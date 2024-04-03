import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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

	// Fetch customers from the database
	const response = await fetch('/api/customers', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		return {
			status: response.status,
			error: new Error('Failed to fetch customers')
		};
	}

	const customers = await response.json();

	return {
		customers
	};
};
