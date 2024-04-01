// API Endpoint: /api/orders

import sql from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

/*
 * GET: Fetches all orders from the database.
 * Doesn't require a request body or parameters.
 * Returns a success message on update or an error message on failure.
 */
export const GET: RequestHandler = async () => {
	try {
		const orders = await sql`
            SELECT order_id, user_order_number, user_order_number, timestamp, status
			FROM orders;
        `;
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
	const { user_id, products } = await request.json();

	// Check if the products array is empty
	if (products.length === 0) {
		return new Response(JSON.stringify({ error: 'An order must contain at least one item.' }), {
			status: 400, // Bad Request
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		await sql.begin(async (sql) => {
			// Create the order
			const [result] = await sql`
	            INSERT INTO orders (user_id, status) VALUES (${user_id}, 'pending') RETURNING order_id;
	        `;

			// Insert each product as an order_item
			for (const product of products) {
				await sql`
			        INSERT INTO order_items (order_id, product_id, quantity)
			        VALUES (${result.order_id}, ${product.product_id}, ${product.quantity});
			    `;
			}
		});

		return new Response(JSON.stringify({ message: 'Order and order items created successfully' }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Failed to create order and order items:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
