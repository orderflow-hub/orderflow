import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate, fail, message } from 'sveltekit-superforms';
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
			customerDetailsForm: await superValidate(customer, zod(formCustomerSchema))
		};
	} catch (error) {
		// Log and handle the error gracefully
		console.error('Error loading customer data:', error);
		throw new Error('Customer retrieval failed');
	}
};
