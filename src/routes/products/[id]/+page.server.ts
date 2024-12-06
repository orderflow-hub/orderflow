import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Product } from '$lib/types';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate, fail } from 'sveltekit-superforms';
import { productSchema } from '$lib/schemas/productSchema';
import humps from 'humps';

export const load: PageServerLoad = async ({ locals, fetch, params }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const { role } = locals.user;

	// Allowed roles: admin
	if (role === 'customer') {
		throw redirect(302, '/products');
	} else if (role !== 'admin') {
		return {
			status: 403,
			error: new Error('Access Denied')
		};
	}

	// Fetch product details from the database for the specified product ID
	const response = await fetch(`/api/products/${params.id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		return {
			status: response.status,
			error: new Error('Failed to fetch product details')
		};
	} else if (response.status === 404) {
		return {
			status: 404,
			error: new Error('Product not found')
		};
	}

	try {
		const product: Product = await response.json();

		if (!product) {
			throw new Error('Product not found');
		}

		return {
			product,
			form: await superValidate(
				{
					productId: product.productId,
					productName: product.productName,
					category: product.category,
					productCode: product.productCode,
					saleUnits: product.saleUnits,
					isDisabled: product.isDisabled
				},
				zod(productSchema)
			)
		};
	} catch (error) {
		return {
			status: 404,
			error: new Error('Product not found')
		};
	}
};

export const actions: Actions = {
	editProduct: async (event) => {
		const form = await superValidate(event, zod(productSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			// TODO: Maybe only send the fields that have changed
			const response = await event.fetch(`/api/products/${form.data.productId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			});

			if (!response.ok) {
				throw new Error('Failed to update product due to bad response');
			}

			// Gets updated Product from json response
			const updatedProduct = await response.json();

			// Returning the form is required for the superform validation to work
			return message(form, {
				status: 'success',
				text: 'Οι αλλαγές αποθηκεύτηκαν επιτυχώς',
				updatedProduct: updatedProduct
			});
		} catch (error) {
			console.error(`Failed to update product: ${error}`);
			return message(form, {
				status: 'failed',
				text: 'Υπήρξε πρόβλημα κατά την αποθήκευση των αλλαγών'
			});
		}
	}
};
