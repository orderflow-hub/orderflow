// API Endpoint: /api/orders/[id]

import sql from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import humps from 'humps';
/*
 * GET: Fetches a single order by ID from the database.
 * Validates the provided ID to ensure it's numeric and exists within the database.
 * Returns product details on success or an error message on failure.
 */
export const GET: RequestHandler = async ({ params }) => {
	const id = params.id;
	if (!id) {
		return new Response(JSON.stringify({ error: 'Order ID is required' }), {
			status: 400
		});
	}

	// Safely convert id to a number
	const orderId = parseInt(id, 10);
	if (isNaN(orderId)) {
		return new Response(JSON.stringify({ error: 'Invalid order ID' }), {
			status: 400
		});
	}

	// Fetches the necessary order details along with the respective's user details
	try {
		// Fetches the order details
		const orderDetails = await sql`
            SELECT o.order_id, o.status, o.user_order_number, u.company_name, o.timestamp, u.street_address, u.city, u.postal_code, u.phone_number, u.afm
			FROM orders as o JOIN users as u ON o.user_id = u.user_id
			WHERE o.order_id = ${orderId};
        `;

		// Checks if the order exists
		if (orderDetails.length === 0) {
			return new Response(JSON.stringify({ error: 'Order not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Fetches the related products for the order
		const products = await sql`
            SELECT p.product_id, oi.snapshot_product_name as product_name, oi.snapshot_product_code as product_code, oi.snapshot_sale_unit as sale_unit, oi.quantity as qty
			FROM order_items as oi JOIN products as p ON oi.product_id = p.product_id
			WHERE oi.order_id = ${orderId};
        `;

		// Checks if the order has any items
		if (products.length === 0) {
			return new Response(JSON.stringify({ error: 'Order has no items' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Combines the order details with the products
		const response = {
			...humps.camelizeKeys(orderDetails[0]),
			products: humps.camelizeKeys(products)
		};

		// Returns the response
		return new Response(JSON.stringify(response), {
			headers: { 'Content-Type': 'application/json' },
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

/*
 * DELETE: Deletes an order by ID.
 * Validates the provided ID and deletes the corresponding product if found.
 * Returns a success message on deletion or an error message on failure.
 */
export const DELETE: RequestHandler = async ({ params }) => {
	const id = params.id;
	if (!id) {
		return new Response(JSON.stringify({ error: 'Order ID is required' }), {
			status: 400
		});
	}

	// Safely convert id to a number
	const orderId = parseInt(id, 10);
	if (isNaN(orderId)) {
		return new Response(JSON.stringify({ error: 'Invalid order ID' }), {
			status: 400
		});
	}

	try {
		const result = await sql`
            DELETE FROM orders WHERE order_id = ${orderId}
        `;
		if (result.count > 0) {
			return new Response(JSON.stringify({ message: 'Order deleted successfully' }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			});
		} else {
			return new Response(JSON.stringify({ error: 'Order not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

/*
 * PATCH: Updates the status of an order by ID, which is provided in the request body.
 * Returns a success message on update or an error message on failure.
 */
export const PATCH: RequestHandler = async ({ params, request }) => {
	const id = params.id;
	const { status } = await request.json();

	if (typeof status === 'undefined' || typeof id === 'undefined') {
		return new Response(JSON.stringify({ error: 'Status and ID are required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// Safely convert id to a number
	const orderId = parseInt(id, 10);
	if (isNaN(orderId)) {
		return new Response(JSON.stringify({ error: 'Invalid order ID' }), {
			status: 400
		});
	}

	try {
		const result = await sql`
            UPDATE orders
            SET status = ${status}
            WHERE order_id = ${orderId}
			RETURNING *;
        `;

		if (result.length > 0) {
			return new Response(
				JSON.stringify({ message: 'Order status updated successfully', order: result[0] }),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		} else {
			return new Response(JSON.stringify({ error: 'Order not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
