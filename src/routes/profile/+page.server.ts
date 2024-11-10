import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate, fail, message } from 'sveltekit-superforms';
import { formPrinterSettingsSchema } from '$lib/schemas/printerSettingsSchema';
import { formCustomerSchema } from '$lib/schemas/customerSchema';
import type { Customer } from '$lib/types';
import { zod } from 'sveltekit-superforms/adapters';
import humps from 'humps';

// Similar to 'src/routes/+page.server.ts'
export const load: PageServerLoad = async ({ locals, fetch }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const { role } = locals.user;

	// Allowed roles: admin, customer
	if (role !== 'admin' && role !== 'customer') {
		throw new Error('Access Denied');
	}

	const userId = locals.user?.user_id;

	if (!userId) {
		throw new Error('Unauthorized');
	}

	try {
		// Fetch customer details from the database for the specified user ID
		const response = await fetch(`/api/customers/${userId}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch customer details with status ${response.status}`);
		}

		// Attempt to parse the response as JSON
		const rawCustomer = await response.json();
		const customer: Customer = humps.camelizeKeys(rawCustomer) as Customer;

		return {
			customer,
			customerDetailsForm: await superValidate(customer, zod(formCustomerSchema)),
			printerSettingsForm: await superValidate(zod(formPrinterSettingsSchema))
		};
	} catch (error) {
		// Log and handle the error gracefully
		console.error('Error loading customer data:', error);
		throw new Error('Customer retrieval failed');
	}
};

export const actions: Actions = {
	savePrinterSettings: async (event) => {
		const form = await superValidate(event, zod(formPrinterSettingsSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// Automatically convert all keys to snake_case
		const formData = humps.decamelizeKeys(form.data);

		// Retrieve the user ID from event.locals.user
		const userId = event.locals.user?.user_id;
		if (!userId) {
			return fail(401, { message: 'Unauthorized: User ID is missing' });
		}

		// Add user_id to the formData before sending it to the API
		const payload = {
			...formData,
			user_id: userId
		};

		try {
			const apiResponse = await event.fetch('api/printer-settings', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!apiResponse.ok) {
				throw new Error('Failed to save settings due to bad response');
			}

			// Gets new settings from JSON resopnse
			const newSettings = await apiResponse.json();

			// Returning the form with a succes message and the settings
			return message(form, {
				status: 'success',
				text: 'Οι ρυθμίσεις εκτυπωτή ενημερώθηκαν επιτυχώς',
				newSettings: newSettings
			});
		} catch (error) {
			throw new Error(`Failed to update printer settings ${error}`);
		}
	}
};
