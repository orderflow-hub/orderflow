import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Customer } from '$lib/types';
import { customerSchema } from '$lib/schemas/customerSchema';
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

	// Fetch customer details from the database for the specified customer ID
	const response = await fetch(`/api/customers/${params.id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		return {
			status: response.status,
			error: new Error('Failed to fetch customer details')
		};
	} else if (response.status === 404) {
		return {
			status: 404,
			error: new Error('Customer not found')
		};
	}

	try {
		const customer: Customer = await response.json();

		if (!customer) {
			throw new Error('Customer not found');
		}

		return {
			customer,
			form: await superValidate(
				{
					customerId: customer.user_id,
					companyName: customer.company_name,
					userCode: customer.user_code,
					email: customer.email,
					phoneNumber: customer.phone_number,
					afm: customer.afm,
					streetAddress: customer.street_address,
					city: customer.city,
					postalCode: customer.postal_code,
					isAccountDisabled: customer.is_account_disabled
				},
				zod(customerSchema)
			)
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
		const form = await superValidate(event, zod(customerSchema));
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
			const response = await event.fetch(`/api/customers/${formData.user_id}`, {
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

			// Returning the form is required for the superform validation to work
			return message(form, { status: 'success', text: 'Οι αλλαγές αποθηκεύτηκαν επιτυχώς' });
		} catch (error) {
			console.error(`Failed to update customer: ${error}`);
			return message(form, {
				status: 'failed',
				text: 'Υπήρξε πρόβλημα κατά την αποθήκευση των αλλαγών'
			});
		}
	}
};
