import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Product } from '$lib/types';

export const load: PageServerLoad = async ({ locals, fetch, params }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const { role } = locals.user;

	// Allowed roles: admin
	if (role === 'customer') {
		throw redirect(302, '/products');
	} else if (role !== 'admin') {
		return {
			status: 403,
			error: new Error('Access Denied')
		};
	}

	// Fetch product details from the database for the specified product ID
	const response = await fetch(`/api/products/${params.id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		return {
			status: response.status,
			error: new Error('Failed to fetch products')
		};
	} else if (response.status === 404) {
		return {
			status: 404,
			error: new Error('Product not found')
		};
	}

	try {
		const product: Product = await response.json();

		if (!product) {
			throw new Error('Product not found');
		}

		return {
			product
		};
	} catch (error) {
		return {
			status: 404,
			error: new Error('Product not found')
		};
	}
};
