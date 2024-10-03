import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { loginFormSchema } from '$lib/schemas/loginFormSchema';

// Similar to 'src/routes/+page.server.ts'
export const load: PageServerLoad = async ({ locals }) => {
	// If the user is logged in, redirect them to '/' (root route)
	// to prevent them from accessing the login page
	if (locals.user) {
		throw redirect(302, '/');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// Parse the form data
		const formData = Object.fromEntries(await request.formData());

		// Validate the input data
		try {
			const result = loginFormSchema.parse(formData);
			return {
				success: true,
				data: formData
			};
		} catch (error) {
			const { fieldErrors: errors } = error.flatten();
			return {
				success: false,
				data: formData,
				errors
			};
		}
	}
};
