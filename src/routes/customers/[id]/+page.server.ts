import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Customer } from '$lib/types';

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
			customer
		};
	} catch (error) {
		return {
			status: 404,
			error: new Error('Customer not found')
		};
	}
};
