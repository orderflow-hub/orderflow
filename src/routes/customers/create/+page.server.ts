import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { customerSchema } from '$lib/schemas/customerSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate, fail } from 'sveltekit-superforms';
import humps from 'humps';

// Similar to 'src/routes/+page.server.ts'
export const load: PageServerLoad = async ({ locals, fetch }) => {
	console.log(locals.user);
	if (!locals.user) {
		console.log('Redirecting to login because user is not authenticated');
		throw redirect(302, '/login');
	}

	const { role } = locals.user;

	// Allowed roles: admin
	if (role === 'customer') {
		console.log('Redirecting to orders because user is a customer');
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

		console.log(formData);

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
				const errorMessage = await response.text();
				throw new Error(`Failed to update customer due to bad response: ${errorMessage}`);
			}

			// Returning the form is required for the superform validation to work
			return message(form, { status: 'success', text: 'Ο πελάτης δημιουργήθηκε επιτυχώς' });
		} catch (error) {
			console.error(`Failed to update customer: ${error}`);
			return message(form, {
				status: 'failed',
				text: 'Υπήρξε πρόβλημα κατά την δημιουργία νέου πελάτη'
			});
		}
	}
};
