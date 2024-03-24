// API Endpoint: /api/customers/[id]

import sql from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

/*
 * GET: Fetches a single customer by ID from the database.
 * Validates the provided ID to ensure it's numeric and exists within the database.
 * Returns necessary customer details on success or an error message on failure.
 */
export const GET: RequestHandler = async ({ params }) => {
	const id = params.id;
	if (!id) {
		return new Response(JSON.stringify({ error: 'Customer ID is required' }), {
			status: 400
		});
	}

	// Safely convert id to a number
	const customerId = parseInt(id, 10);
	if (isNaN(customerId)) {
		return new Response(JSON.stringify({ error: 'Invalid customer ID' }), {
			status: 400
		});
	}

	try {
		const order = await sql`
            SELECT company_name, user_code, email, phone_number, afm, street_address, city, postal_code
            FROM users
            WHERE user_id = ${id};
        `;
		if (order.length > 0) {
			return new Response(JSON.stringify(order[0]), {
				headers: { 'Content-Type': 'application/json' },
				status: 200
			});
		} else {
			return new Response(JSON.stringify({ error: 'Customer not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to fetch customer' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
