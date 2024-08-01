// API Endpoint: /api/customers

import type { RequestHandler } from '@sveltejs/kit';
import sql from '$lib/db';
import { createUser } from '$lib/firebaseAdmin';

/*
 * GET: Fetches all customers from the database.
 * Doesn't require a request body or parameters.
 * Returns a success message on update or an error message on failure.
 */
export const GET: RequestHandler = async ({ url }) => {
	const limit = Number(url.searchParams.get('limit')) || 10;
	const offset = Number(url.searchParams.get('offset')) || 0;
	const searchQuery = url.searchParams.get('search') || '';

	try {
		const customers = await sql`
            SELECT user_id, company_name, email, phone_number, is_account_disabled
            FROM users
            WHERE role = 'customer' AND LOWER(company_name) LIKE '%' || LOWER(${searchQuery}) || '%'
			ORDER BY is_account_disabled ASC, company_name ASC
			LIMIT ${limit} OFFSET ${offset};
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

	// TODO: Validate the request body to ensure all required fields are present

	try {
		// Check if the unique fields already exist in the database
		const existingUser = await sql`
			SELECT * FROM users
			WHERE email = ${data.email} OR user_code = ${data.user_code} OR afm = ${data.afm} OR company_name = ${data.company_name}
		`;

		if (existingUser.length > 0) {
			return new Response(
				JSON.stringify({ error: 'User with provided unique fields already exists' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		// Create a new user using firebaseAdmin. If the user is created successfully
		// userRecord will contain the user's UID
		// Docs: https://firebase.google.com/docs/auth/admin/manage-users#create_a_user
		const userRecord = await createUser(data.email, 'password');
		const uid = userRecord?.uid;
		if (!uid) {
			return new Response(JSON.stringify({ error: 'Failed to create user' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const result = await sql`
			INSERT INTO users
			(firebase_uid, company_name, user_code, email, afm, phone_number, street_address, city, postal_code, role)
			VALUES
			(${uid}, ${data.company_name}, ${data.user_code}, ${data.email}, ${data.afm}, ${data.phone_number || null},
			${data.street_address || null}, ${data.city || null}, ${data.postal_code || null}, 'customer')
			RETURNING *;
		`;

		return new Response(JSON.stringify(result[0]), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Failed to create user:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
