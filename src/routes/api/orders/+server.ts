// API Endpoint: /api/orders

import sql from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import { getUserId } from '$lib/authUtils';

/*
 * GET: Fetches the first 4 orders from the database.
 * Has two optional query parameters: "limit" and "offset".
 * "limit" specifies the number of orders to fetch.
 * "offset" specifies the number of orders to skip.
 * Returns a success message on update or an error message on failure.
 */
export const GET: RequestHandler = async ({ url, locals }) => {
	const limit = Number(url.searchParams.get('limit')) || 4; // Default to 4 for homepage
	const offset = Number(url.searchParams.get('offset')) || 0;
	const searchQuery = url.searchParams.get('search') || '';
	const userRole = locals.user.role;
	const userId = locals.user.uid;

	try {
		let orders;
		if (userRole === 'admin') {
			orders = await sql`
				SELECT o.order_id, o.user_order_number, o.timestamp, o.status, u.company_name
				FROM orders as o
				JOIN users as u ON o.user_id = u.user_id
				WHERE LOWER(u.company_name) LIKE '%' || LOWER(${searchQuery}) || '%'
				ORDER BY o.status DESC, o.timestamp DESC
				LIMIT ${limit} OFFSET ${offset};
		 	`;
		} else if (userRole === 'customer') {
			orders = await sql`
					SELECT o.order_id, o.user_order_number, o.timestamp, o.status, u.company_name
					FROM orders as o
					JOIN users as u ON o.user_id = u.user_id
					WHERE u.firebase_uid = ${userId}
					AND LOWER(u.company_name) LIKE '%' || LOWER(${searchQuery}) || '%'
					ORDER BY o.status DESC, o.timestamp DESC
					LIMIT ${limit} OFFSET ${offset};
				`;
		}
		return new Response(JSON.stringify(orders), {
			headers: { 'Content-Type': 'application/json' },
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

/*
 * POST: Creates a new order.
 * Accepts order details in the request body and inserts a new order into the database.
 * Returns the created order details on success or an error message on failure.
 */

export const POST: RequestHandler = async ({ request }) => {
	const userId = await getUserId(request);

	if (userId === undefined) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const products = await request.json();

	// Check if the products array is empty
	if (products.length === 0) {
		return new Response(JSON.stringify({ error: 'An order must contain at least one item.' }), {
			status: 400, // Bad Request
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		let newOrder;

		await sql.begin(async (sql) => {
			// Create the order and get the inserted order ID
			const [result] = await sql`
                INSERT INTO orders (user_id, status)
                VALUES (${userId}, 'pending')
                RETURNING order_id;
            `;

			// Insert each product as an order_item
			for (const product of products) {
				await sql`
                    INSERT INTO order_items (order_id, product_id, quantity, snapshot_sale_unit)
                    VALUES (${result.order_id}, ${product.product_id}, ${product.qty}, ${product.selected_sale_unit});
                `;
			}

			// Fetch the newly created order
			[newOrder] = await sql`
                SELECT o.order_id, o.user_order_number, o.timestamp, o.status, u.company_name
                FROM orders as o
                JOIN users as u ON o.user_id = u.user_id
                WHERE o.order_id = ${result.order_id};
            `;
		});

		return new Response(
			JSON.stringify({ newOrder, message: 'Order and order items created successfully' }),
			{
				status: 201,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (error) {
		console.error('Failed to create order and order items:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
