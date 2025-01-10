import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { loginFormSchema } from '$lib/schemas/loginFormSchema';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { authHandlers } from '../../stores/authStore';

// Similar to 'src/routes/+page.server.ts'
export const load: PageServerLoad = async ({ locals }) => {
	// If the user is logged in, redirect them to '/' (root route)
	// to prevent them from accessing the login page
	if (locals.user) {
		throw redirect(302, '/');
	}

	return {
		form: await superValidate(zod(loginFormSchema))
	};
};

export const actions: Actions = {
	// Validates form before a login occurs
	default: async (event) => {
		const form = await superValidate(event, zod(loginFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			return message(form, { status: 'success' });
		} catch (error) {
			return fail(400, { form, message: 'Error validating form' });
		}
	}
};
