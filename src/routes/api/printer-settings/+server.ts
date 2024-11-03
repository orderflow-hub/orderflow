// File: src/routes/api/printer-settings/+server.ts

import sql from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	try {
		// Retrieve the user_id from the query parameters
		const userId = url.searchParams.get('user_id');
		if (!userId) {
			return json({ error: 'User ID is required' }, { status: 400 });
		}

		// Query the database for the user's printer IP based on user_id
		const result = await sql`
			SELECT printer_ip
			FROM users
			WHERE user_id = ${userId};
		`;

		if (result.length === 0 || !result[0].printer_ip) {
			return json({ error: 'Printer IP not found for the given user' }, { status: 404 });
		}

		// Return the printer IP if found
		return json({ printerIP: result[0].printer_ip });
	} catch (error) {
		console.error('Error fetching printer settings:', error);
		return json({ error: 'Failed to retrieve printer settings' }, { status: 500 });
	}
};
