import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { productSchema } from '$lib/schemas/productSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, fail, message } from 'sveltekit-superforms';
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
		console.log('Creating product: ' + JSON.stringify(formData));
		
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

			// Gets new Product id from json response
			const responseData = await apiResponse.json();
			const productId = responseData.product_id;

			// Returning the form with a success message and product_id
			return message(form, { 
				status: 'success', 
				text: 'Το προϊόν προστέθηκε επιτυχώς', 
				productId: productId
			});
		} catch (error) {
			throw new Error(`Failed to create product ${error}`);
		}
	}
};
