/* API Endpoint: /api/products/[id] */

import sql from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import type { ParameterOrJSON } from 'postgres';

/*
 * GET: Retrieves a product by ID.
 * Validates the provided ID to ensure it's numeric and exists within the database.
 * Returns product details on success or an error message on failure.
 */
export const GET: RequestHandler = async ({ params }) => {
	// Ensure id is defined and is a string
	const id = params.id;
	if (!id) {
		return new Response(JSON.stringify({ error: 'Product ID is required' }), {
			status: 400
		});
	}

	// Safely convert id to a number
	const productId = parseInt(id, 10);
	if (isNaN(productId)) {
		return new Response(JSON.stringify({ error: 'Invalid product ID' }), {
			status: 400
		});
	}

	try {
		const product = await sql`
            SELECT *
			FROM products
			WHERE product_id = ${productId}
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
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

/*
 * PATCH: Updates a product by ID.
 * Only updates fields provided in the request body, ignoring any not listed in allowedColumns.
 * Returns a success message on update or an error message on failure.
 */
export const PATCH: RequestHandler = async ({ params, request }) => {
	const id = params.id;
	if (!id) {
		return new Response(JSON.stringify({ error: 'Product ID is required' }), {
			status: 400
		});
	}

	// Safely convert id to a number
	const productId = parseInt(id, 10);
	if (isNaN(productId)) {
		return new Response(JSON.stringify({ error: 'Invalid product ID' }), {
			status: 400
		});
	}

	// Parse the request body to get the updated product details
	const data = await request.json();

	// Define allowed keys to prevent SQL injection
	const allowedColumns = ['product_code', 'product_name', 'sale_unit', 'is_disabled', 'image_url'];

	const updates = Object.entries(data)
		.filter(([key]) => allowedColumns.includes(key))
		.map(([key, value], index) => `${key} = $${index + 1}`); // Start indexing at 1 for values

	if (updates.length === 0) {
		throw new Error('No valid fields provided for update');
	}

	const query = `
		UPDATE products
		SET ${updates.join(', ')}
		WHERE product_id = ${productId}
		RETURNING *
	`;

	// Filter only the values for the allowed updates
	const values = Object.values(data).filter((value, index) =>
		allowedColumns.includes(Object.keys(data)[index])
	);

	try {
		// The unsafe method allows for executing the dynamic query with parameter binding
		const result = await sql.unsafe(query, values as ParameterOrJSON<any>[]);
		return new Response(
			JSON.stringify({ message: 'Product updated successfully', product: result[0] }),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (error) {
		console.error('Failed to update product:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

/*
 * DELETE: Deletes a product by ID.
 * Validates the provided ID and deletes the corresponding product if found.
 * Returns a success message on deletion or an error message on failure.
 */
export const DELETE: RequestHandler = async ({ params }) => {
	const id = params.id;
	if (!id) {
		return new Response(JSON.stringify({ error: 'Product ID is required' }), {
			status: 400
		});
	}
	const productId = parseInt(id, 10);

	if (isNaN(productId)) {
		return new Response(JSON.stringify({ error: 'Invalid product ID' }), {
			status: 400
		});
	}

	try {
		await sql`
            DELETE FROM products
            WHERE product_id = ${productId}
        `;

		return new Response(JSON.stringify({ message: 'Product deleted successfully' }), {
			status: 200
		});
	} catch (error) {
		console.error('Failed to delete product:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
