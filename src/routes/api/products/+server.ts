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

		const limit = Number(url.searchParams.get('limit')) || 10;
		const offset = Number(url.searchParams.get('offset')) || 0;
		const searchQuery = url.searchParams.get('search') ?? '';
		const category = url.searchParams.get('category') ?? 'all';

		// Define a function to filter by category
		const filterByCategory = (category: string) => {
			if (category === 'all') {
				return sql``; // No additional filtering if 'all'
			}
			return sql`AND category = ${category}`;
		};

		try {
			const products = await sql`
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
					LOWER(p.product_name) LIKE '%' || LOWER(${searchQuery}) || '%'
				${filterByCategory(category)}
				GROUP BY 
					p.product_id
				ORDER BY 
					p.is_disabled ASC, p.product_name ASC
				LIMIT ${limit} OFFSET ${offset};
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
        const result = await sql.begin(async (sql) => {
            // Insert the new product
            const [newProduct] = await sql`
                INSERT INTO products 
                (product_code, product_name, category, is_disabled, image_url) 
                VALUES 
                (${data.product_code}, ${data.product_name}, ${data.category}, ${data.is_disabled}, ${data.image_url || null})
                RETURNING *;
            `;

            const saleUnits = data.sale_units as ('kg' | 'piece' | 'crates')[];

            // Delete any existing sale units (though not necessary for new products)
            await sql`
                DELETE FROM product_sale_unit
                WHERE product_id = ${newProduct.product_id};
            `;

            // Insert the new sale units for the product
            for (const saleUnit of saleUnits) {
                const [saleUnitIdResult] = await sql`
                    SELECT sale_unit_id FROM sale_units WHERE sale_unit = ${saleUnit};
                `;
                const saleUnitId = saleUnitIdResult.sale_unit_id;

                await sql`
                    INSERT INTO product_sale_unit (product_id, sale_unit_id)
                    VALUES (${newProduct.product_id}, ${saleUnitId});
                `;
            }

            // Fetch the inserted product details along with the sale units
            const [createdProduct] = await sql`
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
                    p.product_id = ${newProduct.product_id}
                GROUP BY 
                    p.product_id;
            `;

            return createdProduct;
        });

        // Return the newly created product details
        return new Response(
            JSON.stringify(result),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error('Failed to create product:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};