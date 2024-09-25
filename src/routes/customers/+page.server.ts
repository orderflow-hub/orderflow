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
			const newUser = await response.json();

			// Returning the form with a success message and customer id
			return message(form, { 
				status: 'success',
				text: 'Ο χρήστης προστέθηκε επιτυχώς',
				newUser: newUser
			});
		} catch (error) {
			console.error(`Failed to create Customer: ${error}`);
			return message(form, {
				status: 'failed',
				text: 'Υπήρξε πρόβλημα κατά την δημιουργία πελάτη'
			});
		}
	}
};