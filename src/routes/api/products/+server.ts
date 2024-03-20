/*
 * API Endpoint: /api/products
 * Method: GET
 * Description: Retrieves a list of all products from the database.
 *              This endpoint does not require request parameters in the body; it is designed to return an array of product objects.
 *              Each product object contains all the details of a product as stored in the database.
 * Request: No request body needed for this endpoint. (Note: If authentication is implemented, a token might be required in request headers, not the body.)
 * Response: On success: JSON array of objects, where each object represents a product with all its details from the database.
 *           On failure: JSON object with an error message, indicating the failure to fetch products from the database.
 *           Possible HTTP status codes include 200 for a successful fetch, and 500 for internal server errors.
 */

import sql from '$lib/db';

export async function GET() {
	try {
		const products = await sql`
            SELECT * FROM products;
        `;

		return new Response(JSON.stringify(products), {
			headers: { 'Content-Type': 'application/json' },
			status: 200
		});
	} catch (error) {
		return new Response(
			JSON.stringify({
				error: 'Failed to fetch products'
			}),
			{
				status: 500
			}
		);
	}
}
