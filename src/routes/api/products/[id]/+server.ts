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
			SELECT 
				p.product_id,
				p.image_url,
				p.product_name,
				p.product_code,
				p.is_disabled,
				p.category,
				array_agg(su.sale_unit) AS sale_units
			FROM 
				products p
			LEFT JOIN 
				product_sale_unit psu ON p.product_id = psu.product_id
			LEFT JOIN 
				sale_units su ON psu.sale_unit_id = su.sale_unit_id
			WHERE 
				p.product_id = ${productId}
			GROUP BY 
				p.product_id
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
	const allowedColumns = ['product_code', 'product_name', 'is_disabled', 'image_url'];
	const saleUnitsKey = 'sale_units';

	const updates = Object.entries(data)
		.filter(([key]) => allowedColumns.includes(key))
		.map(([key, value], index) => `${key} = $${index + 1}`); // Start indexing at 1 for values

	if (updates.length === 0 && !data[saleUnitsKey]) {
		return new Response(JSON.stringify({ error: 'No valid fields provided for update' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const updateProductQuery = `
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
		const result = await sql.begin(async (sql) => {
			let updatedProduct;
			if (updates.length > 0) {
				// Execute the dynamic query with parameter binding
				const result = await sql.unsafe(updateProductQuery, values as ParameterOrJSON<any>[]);
				updatedProduct = result[0];
			}

			if (data[saleUnitsKey]) {
				// Update the product_sale_unit table
				const saleUnits = data[saleUnitsKey] as ('kg' | 'piece' | 'crates')[];

				// Delete existing sale units for the product
				await sql`
					DELETE FROM product_sale_unit
					WHERE product_id = ${productId}
				`;

				// Insert new sale units for the product
				for (const saleUnit of saleUnits) {
					const saleUnitIdResult = await sql`
						SELECT sale_unit_id FROM sale_units WHERE sale_unit = ${saleUnit}
					`;
					const saleUnitId = saleUnitIdResult[0].sale_unit_id;

					await sql`
						INSERT INTO product_sale_unit (product_id, sale_unit_id)
						VALUES (${productId}, ${saleUnitId})
					`;
				}
			}

			return updatedProduct;
		});

		return new Response(
			JSON.stringify({ message: 'Product updated successfully', product: result }),
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
