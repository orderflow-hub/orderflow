import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const role = locals.user?.role;

	return {
		userRole: role
	};
};
