import type { LayoutServerLoad } from './$types';

/* This function is called on every page load.
 * It retrieves the user's role from locals and adds it to the layout's props.
 *
 * This is a server-side function, so it can access server-only code and secrets.
 * It runs on the server and updates the layout's props before the page is rendered.
 *
 * The role is added to locals in the handle function in src/hooks.server.ts.
 */
export const load: LayoutServerLoad = async ({ locals }) => {
	const role = locals.user?.role;

	return {
		userRole: role
	};
};
