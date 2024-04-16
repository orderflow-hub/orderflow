/* API Endpoint: /api/products */

import sql from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

/*
 * GET: Fetches all products from the database.
 * If a parameter 'counts' is present in the query, it returns the count of active and inactive products.
 * Returns a success message on update or an error message on failure.
 */
export const GET: RequestHandler = async ({ url }) => {
	// Check for a query parameter that signifies a request for counts
	const isCountRequest = url.searchParams.has('counts');

	if (isCountRequest) {
		// Fetch counts of active and inactive products
		try {
			const activeCount = await sql`SELECT COUNT(*) FROM products WHERE is_disabled = false;`;
			const inactiveCount = await sql`SELECT COUNT(*) FROM products WHERE is_disabled = true;`;

			return new Response(
				JSON.stringify({
					activeCount: Number(activeCount[0].count),
					inactiveCount: Number(inactiveCount[0].count)
				}),
				{
					headers: { 'Content-Type': 'application/json' },
					status: 200
				}
			);
		} catch (error) {
			return new Response(JSON.stringify({ error: 'Failed to fetch product counts' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	} else {
		// Fetch all products
		try {
			const products = await sql`
				SELECT product_id, product_name, product_code, sale_unit, is_disabled, image_url
				FROM products
				ORDER BY is_disabled ASC, product_name ASC;
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
	}
};

/*
 * POST: Creates a new product.
 * Accepts product details in the request body and inserts a new product into the database.
 * Returns the created product details on success or an error message on failure.
 */
export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	// Check if the unique fields already exist in the database
	const existingProducts = await sql`
		SELECT product_code FROM products
		WHERE product_code = ${data.product_code}
	`;

	if (existingProducts.length > 0) {
		return new Response(
			JSON.stringify({ error: 'Product with provided unique product code already exists' }),
			{
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	try {
		const result = await sql`
			INSERT INTO products 
			(product_code, product_name, sale_unit, is_disabled, image_url) 
			VALUES 
			(${data.product_code}, ${data.product_name}, ${data.sale_unit}, ${data.is_disabled}, ${data.image_url || null})
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
