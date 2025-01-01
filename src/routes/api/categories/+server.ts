/* API Endpoint: /api/categories */
import sql from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import humps from 'humps';
/*
 * GET: Fetches all categories from the database.
 * Returns a JSON list of categories or an error message on failure.
 */
export const GET: RequestHandler = async () => {
	try {
		// Query to fetch all categories
		const categories = await sql`
            SELECT category_id, category, category_label
            FROM categories;
        `;
		return new Response(JSON.stringify(humps.camelizeKeys(categories)), {
			headers: { 'Content-Type': 'application/json' },
			status: 200
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				error: 'Failed to fetch categories'
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
