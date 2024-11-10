/* API Endpoint: /api/printer-settings */

import sql from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

/*
 * PATCH: Updates printer settings for the authenticated user.
 * Accepts printer settings in the request body and updates the database.
 * Returns the saved printer settings on success or an error message on failure.
 */
export const PATCH: RequestHandler = async ({ request, locals }) => {
	// Ensure user is authenticated and get user_id
	const userId = locals.user?.user_id;
	if (!userId) {
		return new Response(JSON.stringify({ error: 'Μη εξουσιοδοτημένος χρήστης' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const data = await request.json();

	try {
		// Upsert the printer settings for the user
		const [updatedSettings] = await sql`
			UPDATE users
            SET printer_ip = ${data.printer_ip || null}
            WHERE user_id = ${userId}
            RETURNING printer_ip;
		`;

		// Return the saved or updated printer settings
		return new Response(JSON.stringify(updatedSettings), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Αποτυχία αποθήκευσης των ρυθμίσεων του εκτυπωτή:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
