import sql from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

/*
 * GET: Fetches a single order by ID from the database.
 * Request: Order ID in URL path.
 * Response:
 * - 200: JSON object of the order details.
 * - 404: Order not found error message.
 * - 500: Error message in case of an internal server error.
 */
export const GET: RequestHandler = async ({ params }) => {
	const id = params.id;
	if (!id) {
		return new Response(JSON.stringify({ error: 'Order ID is required' }), {
			status: 400
		});
	}

	// Safely convert id to a number
	const productId = parseInt(id, 10);
	if (isNaN(productId)) {
		return new Response(JSON.stringify({ error: 'Invalid order ID' }), {
			status: 400
		});
	}

	try {
		const order = await sql`
            SELECT * FROM orders WHERE order_id = ${id};
        `;
		if (order.length > 0) {
			return new Response(JSON.stringify(order[0]), {
				headers: { 'Content-Type': 'application/json' },
				status: 200
			});
		} else {
			return new Response(JSON.stringify({ error: 'Order not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	} catch (error) {
		console.error('Failed to fetch order:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

/*
 * DELETE: Deletes an order by ID.
 * Request: Order ID in URL path.
 * Response:
 * - 200: Success message indicating order deletion.
 * - 404: Order not found error message.
 * - 500: Error message in case of an internal server error.
 */
export const DELETE: RequestHandler = async ({ params }) => {
	const id = params.id;
	if (!id) {
		return new Response(JSON.stringify({ error: 'Order ID is required' }), {
			status: 400
		});
	}

	// Safely convert id to a number
	const productId = parseInt(id, 10);
	if (isNaN(productId)) {
		return new Response(JSON.stringify({ error: 'Invalid order ID' }), {
			status: 400
		});
	}

	try {
		const result = await sql`
            DELETE FROM orders WHERE order_id = ${id}
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
		console.error('Failed to delete order:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

/*
 * PATCH: Updates the status of an order by ID.
 * Request: Order ID in URL path and new status in request body.
 * Response:
 * - 200: Success message indicating order status update.
 * - 404: Order not found error message.
 * - 500: Error message in case of an internal server error.
 */
// export const PATCH: RequestHandler = async ({ params, request }) => {
// 	const { id } = params;
// 	const { status } = await request.json(); // Assuming the new status is provided in the request body

// 	try {
// 		const result = await sql`
//             UPDATE orders
//             SET status = ${status}
//             WHERE order_id = ${id}
//             RETURNING *
//         `;

// 		if (result.length > 0) {
// 			return new Response(
// 				JSON.stringify({ message: 'Order status updated successfully', order: result[0] }),
// 				{
// 					status: 200,
// 					headers: { 'Content-Type': 'application/json' }
// 				}
// 			);
// 		} else {
// 			return new Response(JSON.stringify({ error: 'Order not found' }), {
// 				status: 404,
// 				headers: { 'Content-Type': 'application/json' }
// 			});
// 		}
// 	} catch (error) {
// 		console.error('Failed to update order status:', error);
// 		return new Response(JSON.stringify({ error: 'Internal server error' }), {
// 			status: 500,
// 			headers: { 'Content-Type': 'application/json' }
// 		});
// 	}
// };
