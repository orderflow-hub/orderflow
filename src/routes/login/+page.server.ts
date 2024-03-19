import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Similar to 'src/routes/+page.server.ts'
export const load: PageServerLoad = async ({ locals }) => {
	// If the user is logged in, redirect them to '/' (root route)
	// to prevent them from accessing the login page
	if (locals.user) {
		throw redirect(302, '/');
	}

	return {};
};
