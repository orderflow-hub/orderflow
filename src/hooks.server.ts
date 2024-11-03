import type { Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import { authAdmin } from '$lib/firebaseAdmin';
import sql from '$lib/db';

export const handle: Handle = async ({ event, resolve }) => {
	// Parse the cookies from the request and extract the session cookie
	const cookies = parse(event.request.headers.get('cookie') ?? '');
	const session = cookies.session;

	// Add the database instance to locals so pages can access it
	event.locals.sql = sql;

	if (session) {
		try {
			// Verify the session cookie via firebase-admin to ensure it's valid and has not been tampered with or expired
			const decodedToken = await authAdmin.verifySessionCookie(session, true);
			if (decodedToken) {
				// If the session cookie is valid, extract the user's UID and role from the database and add it to the event locals
				const uid = decodedToken.uid;

				const userRole = await getUserRoleFromDatabase(uid);
				if (userRole) {
					event.locals.user = { uid, role: userRole };
				} else {
					// Handle the case when user role is null
					console.error('User role is null');
					// This shouldn't happen
				}
			} else {
				// Handle the case when UID is null
				console.error('UID is null');
				// The token is invalid
			}
		} catch (error) {
			// Optionally handle token verification failure
			console.error('Token verification failed:', error);
		}
	}

	const response = await resolve(event);
	return response;
};

// This function queries the database to get the user's role based on their UID retrieved from the session cookie
async function getUserRoleFromDatabase(uid: string) {
	const userRole = await sql`SELECT role FROM users WHERE firebase_uid = ${uid}`;
	return userRole[0].role;
}
