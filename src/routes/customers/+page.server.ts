import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { create } from 'domain';
import { fail, message } from 'sveltekit-superforms';
import { customerSchema } from '$lib/schemas/customerSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import humps from 'humps';

// Similar to 'src/routes/+page.server.ts'
export const load: PageServerLoad = async ({ locals, fetch }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const { role } = locals.user;

	// Allowed roles: admin
	if (role === 'customer') {
		throw redirect(302, '/orders');
	} else if (role !== 'admin') {
		return {
			status: 403,
			error: new Error('Access Denied')
		};
	}

	// // Fetch customers from the database
	// const response = await fetch('/api/customers', {
	// 	method: 'GET',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	}
	// });

	// if (!response.ok) {
	// 	return {
	// 		status: response.status,
	// 		error: new Error('Failed to fetch customers')
	// 	};
	// }

	// const customers = await response.json();

	// customers,
	return {
		form: await superValidate(zod(customerSchema))
	};
};

export const actions: Actions = {
	createCustomer: async (event) => {
		const form = await superValidate(event, zod(customerSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// Convert form data to snake_case with humps library
		const formData = humps.decamelizeKeys(form.data);

		try {
			// Create a new customer
			const response = await event.fetch('/api/customers', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				throw new Error('Failed to create customer due to bad response');
			}

			// Gets new Product id from json response
			const responseData = await response.json();
			console.log(responseData);
			const userId = responseData.user_id;

			// Returning the form with a success message and customer id
			return message(form, { 
				status: 'success',
				text: 'Ο χρήστης προστέθηκε επιτυχώς',
				userId: userId
			});
		} catch (error) {
			throw new Error(`Failed to create customer ${error}`);
		}
	}
};