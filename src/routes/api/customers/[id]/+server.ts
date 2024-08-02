// API Endpoint: /api/customers/[id]

import sql from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import { updateEmail, deleteUser } from '$lib/firebaseAdmin';

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
            SELECT user_id, company_name, user_code, email, phone_number, afm, street_address, city, postal_code, is_account_disabled
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

/*
 * PATCH: Updates a customer's details in the database.
 * Validates the provided ID and request body to ensure they're valid.
 * Returns the updated customer details on success or an error message on failure.
 */
export const PATCH: RequestHandler = async ({ params, request }) => {
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

	const data = await request.json();

	try {
		const user = await sql`
            SELECT * FROM users
            WHERE user_id = ${id};
        `;

		if (user.length === 0) {
			return new Response(JSON.stringify({ error: 'Customer not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Check if provided user code already exists.
		const userCodeUsed = await sql`
			SELECT COUNT(*) 
			FROM users 
			WHERE user_code = ${data.user_code}
			AND user_id != ${data.user_id};
		`;

		if(userCodeUsed[0].count > 0) {
			return new Response(JSON.stringify({ error: 'Customer code is already in use.' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// If the email is being updated, update it in Firebase too
		if (data.email && data.email !== user[0].email) {
			const emailUpdated = await updateEmail(user[0].firebase_uid, data.email);
			if (!emailUpdated) {
				return new Response(JSON.stringify({ error: 'Failed to update email in Firebase' }), {
					status: 500,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		}

		const result = await sql`
            UPDATE users
            SET company_name = ${data.company_name}, user_code = ${data.user_code}, email = ${data.email}, phone_number = ${data.phone_number}, afm = ${data.afm}, street_address = ${data.street_address}, city = ${data.city}, postal_code = ${data.postal_code}, is_account_disabled = ${data.is_account_disabled}
            WHERE user_id = ${id}
            RETURNING *;
        `;

		if (result.length > 0) {
			return new Response(JSON.stringify(result[0]), {
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
		return new Response(JSON.stringify({ error: 'Failed to update customer' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

/*
 * DELETE: Deletes a customer from the database.
 * Validates the provided ID to ensure it's numeric and exists within the database.
 * Returns a success message on successful deletion or an error message on failure.
 */
export const DELETE: RequestHandler = async ({ params }) => {
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
		const user = await sql`
            SELECT * FROM users
            WHERE user_id = ${id};
        `;

		if (user.length === 0) {
			return new Response(JSON.stringify({ error: 'Customer not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Delete the user from Firebase
		if (await deleteUser(user[0].firebase_uid)) {
			const result = await sql`
				DELETE FROM users
				WHERE user_id = ${id};
			`;

			if (result.count > 0) {
				return new Response(JSON.stringify({ message: 'Customer deleted successfully' }), {
					headers: { 'Content-Type': 'application/json' },
					status: 200
				});
			} else {
				return new Response(JSON.stringify({ error: 'Customer not found' }), {
					status: 404,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		} else {
			return new Response(JSON.stringify({ error: 'Failed to delete user from Firebase' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to delete customer' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
