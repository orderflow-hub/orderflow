/*
 * API Endpoint: /api/products/[id]
 * Method: GET
 * Description: Retrieves a product from the database with a specific product_id.
 *              Validates the provided ID to ensure it's numeric and exists within the database.
 *              If the product is found, returns the product details. If the product is not found or if the ID is invalid, returns an error message.
 * Request Parameters: id (in URL path)
 * Response: On success: JSON object containing the product's details.
 *           On failure: JSON object with an error message.
 *           Possible HTTP status codes include 400 for invalid ID format, 404 for product not found, and 500 for internal server errors.
 */

import sql from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	// Ensure id is defined and is a string
	const id = params.id;
	if (!id) {
		return new Response(JSON.stringify({ error: 'Product ID is required' }), {
			status: 400
		});
	}

	// Safely convert id to a number, assuming product_id is a numeric type in your database
	const productId = parseInt(id, 10);
	if (isNaN(productId)) {
		return new Response(JSON.stringify({ error: 'Invalid product ID' }), {
			status: 400
		});
	}

	try {
		const product = await sql`
            SELECT * FROM products WHERE product_id = ${productId}
        `;

		if (product.length > 0) {
			return new Response(JSON.stringify(product[0]), {
				headers: { 'Content-Type': 'application/json' },
				status: 200
			});
		} else {
			return new Response(JSON.stringify({ error: 'Product not found' }), {
				status: 404
			});
		}
	} catch (error) {
		console.error('Failed to fetch product:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500
		});
	}
};
