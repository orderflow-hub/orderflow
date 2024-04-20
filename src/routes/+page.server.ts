import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/* This function is called on every page load.
 * It runs on the server before the page is rendered.
 * We check the user's role and redirect them to the appropriate page based on their role.
 * The user is served only the pages they are allowed to access.
 */
export const load: PageServerLoad = async ({ locals, fetch }) => {
	// If the user is not logged in, redirect them to the login page
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// If the user is logged in, check their role
	const { role } = locals.user;

	// Allowed roles: admin
	// Handle each role accordingly
	if (role === 'customer') {
		throw redirect(302, '/orders');
	} else if (role !== 'admin') {
		return {
			status: 403,
			error: new Error('Access Denied')
		};
	}

	// Fetch orders from the database
	const ordersResponse = await fetch('/api/orders', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!ordersResponse.ok) {
		return {
			status: ordersResponse.status,
			error: new Error('Failed to fetch orders')
		};
	}

	const orders = await ordersResponse.json();

	const countsResponse = await fetch('/api/products?counts', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!countsResponse.ok) {
		return {
			status: countsResponse.status,
			error: new Error('Failed to fetch product counts')
		};
	}
	const { activeCount, inactiveCount } = await countsResponse.json();
	return {
		orders,
		activeProductCount: activeCount,
		inactiveProductCount: inactiveCount
	};
};
