import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Order } from '$lib/types';

export const load: PageServerLoad = async ({ locals, fetch, params }) => {
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

	// Fetch order details from the database for the specified order ID
	const response = await fetch(`/api/orders/${params.id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		return {
			status: response.status,
			error: new Error('Failed to fetch order details')
		};
	} else if (response.status === 404) {
		return {
			status: 404,
			error: new Error('Order not found')
		};
	}

	try {
		const order: Order = await response.json();

		if (!order) {
			throw new Error('Order not found');
		}

		return {
			order
		};
	} catch (error) {
		return {
			status: 404,
			error: new Error('Order not found')
		};
	}
};
