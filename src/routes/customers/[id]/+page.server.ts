import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Customer } from '$lib/types';
import { formCustomerSchema } from '$lib/schemas/customerSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate, fail } from 'sveltekit-superforms';
import humps from 'humps';

export const load: PageServerLoad = async ({ locals, fetch, params }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const { role } = locals.user;

	// Allowed roles: admin
	if (role === 'customer') {
		throw redirect(302, '/customers');
	} else if (role !== 'admin') {
		return {
			status: 403,
			error: new Error('Access Denied')
		};
	}

	try {
		// Fetch customer details from the database for the specified customer ID
		const response = await fetch(`/api/customers/${params.id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch customer details with status ${response.status}`);
		}

		// Attempt to parse the response as JSON
		const rawCustomer = await response.json();
		const customer: Customer = humps.camelizeKeys(rawCustomer) as Customer;

		return {
			customer,
			form: await superValidate(customer, zod(formCustomerSchema))
		};
	} catch (error) {
		return {
			status: 404,
			error: new Error('Customer not found')
		};
	}
};

export const actions: Actions = {
	editCustomer: async (event) => {
		const form = await superValidate(event, zod(formCustomerSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// Convert form data to snake_case with humps library
		// Assert the type to match the Customer interface
		const { customerId, ...rest } = form.data;
		const formData = humps.decamelizeKeys({ userId: customerId, ...rest }) as Customer;

		try {
			// TODO: Maybe only send the fields that have changed
			const response = await event.fetch(`/api/customers/${formData.userId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				const errorMessage = await response.text();
				throw new Error(`Failed to update customer due to bad response: ${errorMessage}`);
			}

			// Gets updated Customer from json response
			const updatedCustomer = await response.json();

			// Returning the form is required for the superform validation to work
			return message(form, {
				status: 'success',
				text: 'Οι αλλαγές αποθηκεύτηκαν επιτυχώς',
				updatedCustomer: updatedCustomer
			});
		} catch (error) {
			console.error(`Failed to update customer: ${error}`);
			return message(form, {
				status: 'failed',
				text: 'Υπήρξε πρόβλημα κατά την αποθήκευση των αλλαγών'
			});
		}
	}
};
