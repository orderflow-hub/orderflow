// API Endpoint: /api/customers

import type { RequestHandler } from '@sveltejs/kit';
import sql from '$lib/db';

/*
 * GET: Fetches all customers from the database.
 * Doesn't require a request body or parameters.
 * Returns a success message on update or an error message on failure.
 */
export const GET: RequestHandler = async () => {
	try {
		const customers = await sql`
            SELECT user_id, company_name, email, phone_number
            FROM users
            WHERE role = 'customer';
        `;
		return new Response(JSON.stringify(customers), {
			headers: { 'Content-Type': 'application/json' },
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to fetch customers' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

/*
 * POST: Creates a new customer.
 * Accepts customer info in the request body and inserts a new customer into the database as a new user.
 * Returns the created customer details on success or an error message on failure.
 */
export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	// TODO: Validate the request body to ensure all required fields are present and call the firebase function to create a new user

	try {
		const result = await sql`
			INSERT INTO users
			(firebase_uid, company_name, user_code, email, afm, phone_number, street_address, city, postal_code, role)
			VALUES
			(${data.firebase_uid}, ${data.company_name}, ${data.user_code}, ${data.email}, ${data.afm}, ${data.phone_number || null},
			${data.street_address || null}, ${data.city || null}, ${data.postal_code || null}, 'customer')
			RETURNING *;
		`;

		return new Response(JSON.stringify(result), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Failed to create product:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

// TODO: Implement PATCH and DELETE methods for updating and deleting customers
