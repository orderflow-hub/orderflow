import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Similar to 'src/routes/+page.server.ts'
export const load: PageServerLoad = async ({ locals, fetch }) => {
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

	// // Previous implementation without search functionality
	// const limit = 5;
	// const offset = 0;

	// // Fetch orders from the database
	// const response = await fetch(`/api/orders?limit=${limit}&offset=${offset}`, {
	// 	method: 'GET',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	}
	// });

	// if (!response.ok) {
	// 	return {
	// 		status: response.status,
	// 		error: new Error('Failed to fetch orders')
	// 	};
	// }

	// const orders = await response.json();

	// return {
	// 	orders
	// };
};
