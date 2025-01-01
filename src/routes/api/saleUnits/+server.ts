/* API Endpoint: /api/saleUnits */

import sql from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import humps from 'humps';

/*
 * GET: Fetches all sale units from the database.
 * Returns a JSON list of sale units or an error message on failure.
 */
export const GET: RequestHandler = async () => {
    try {
        // Query to fetch all sale units
        const saleUnits = await sql`
            SELECT sale_unit_id, sale_unit, sale_unit_label
            FROM sale_units;
        `;

        return new Response(JSON.stringify(humps.camelizeKeys(saleUnits)), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: 'Failed to fetch sale units'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
};