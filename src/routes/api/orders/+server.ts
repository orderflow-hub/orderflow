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
            SELECT * FROM orders;
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
	const data = await request.json();
	try {
		const result = await sql`
            INSERT INTO orders (user_id, status) VALUES
            (${data.user_id}, ${data.status})
            RETURNING *
        `;
		return new Response(JSON.stringify(result[0]), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Failed to create order:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
