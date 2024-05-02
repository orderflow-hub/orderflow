import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserId } from '$lib/authUtils';
import type { Customer } from '$lib/types';
import { customerSchema } from '$lib/schemas/customerSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

// Similar to 'src/routes/+page.server.ts'
export const load: PageServerLoad = async ({ locals, fetch, request }) => {
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

	const userId = await getUserId(request);

	if (userId === undefined) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// Fetch customer details from the database for the specified customer ID
	const response = await fetch(`/api/customers/${userId}`, {
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
