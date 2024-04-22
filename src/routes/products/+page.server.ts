import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fail } from 'sveltekit-superforms';
import { productSchema } from '$lib/schemas/productSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import humps from 'humps';

// Similar to 'src/routes/+page.server.ts'
export const load: PageServerLoad = async ({ locals, fetch }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const { role } = locals.user;

	// Allowed roles: admin, customer
	if (role !== 'admin' && role !== 'customer') {
		return {
			status: 403,
			error: new Error('Access Denied')
		};
	}

	// // Fetch products from the database
	// const response = await fetch('/api/products', {
	// 	method: 'GET',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	}
	// });

	// if (!response.ok) {
	// 	return {
	// 		status: response.status,
	// 		error: new Error('Failed to fetch products')
	// 	};
	// }

	// const products = await response.json();

	// return {
	// 	products,
	// 	form: await superValidate(zod(productSchema))
	// };

	return {
		form: await superValidate(zod(productSchema))
	};
};

// TODO redirect to updated product list
export const actions: Actions = {
	createProduct: async (event) => {
		const form = await superValidate(event, zod(productSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// Convert form data to snake_case with humps library
		const formData = humps.decamelizeKeys(form.data);

		// console.log(formData);

		try {
			const apiResponse = await event.fetch('api/products', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (!apiResponse.ok) {
				// TODO toast message
				throw new Error('Failed to create product due to bad response');
			}

			// Returning the form is required for the superform validation to work
			return {
				form
			};
		} catch (error) {
			throw new Error(`Failed to create product ${error}`);
		}
	}
};
