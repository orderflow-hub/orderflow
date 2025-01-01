import type { LayoutServerLoad } from './$types';

/* This function is called on every page load.
 * It retrieves the user's role from locals and adds it to the layout's props.
 *
 * This is a server-side function, so it can access server-only code and secrets.
 * It runs on the server and updates the layout's props before the page is rendered.
 *
 * The role is added to locals in the handle function in src/hooks.server.ts.
 */
export const load: LayoutServerLoad = async ({ locals, fetch }) => {
	const role = locals.user?.role;

	// Fetch sale units on page load
	// TODO: Implement lazy loading instead
	const saleUnitsResponse = await fetch('/api/saleUnits');
	if (!saleUnitsResponse.ok) {
		throw new Error('Failed to fetch sale units');
	}
	const saleUnits = await saleUnitsResponse.json();

	return {
		userRole: role,
		saleUnits: saleUnits
	};
};
