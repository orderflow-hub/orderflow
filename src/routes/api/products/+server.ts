/* API Endpoint: /api/products */

import sql from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

/*
 * GET: Fetches all products from the database.
 * Doesn't require a request body or parameters.
 * Returns a success message on update or an error message on failure.
 */
export const GET: RequestHandler = async () => {
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
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};

/*
 * POST: Creates a new product.
 * Accepts product details in the request body and inserts a new product into the database.
 * Returns the created product details on success or an error message on failure.
 */
export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	try {
		const result = await sql`
			INSERT INTO products 
			(product_code, product_name, sale_unit, is_available, image_url) 
			VALUES 
			(${data.product_code}, ${data.product_name}, ${data.sale_unit}, ${data.is_available}, ${data.image_url || null})
			RETURNING *
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
