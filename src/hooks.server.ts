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

				// Retrieves user data from the database
				const userData = await getUserFromDatabase(uid);
				if (userData != null) {
					event.locals.user = { uid, id: userData.user_id, role: userData.role };
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

// This function queries the database to get the user's information based on their UID retrieved from the session cookie
async function getUserFromDatabase(uid: string) {
	const [user] = await sql`SELECT * FROM users WHERE firebase_uid = ${uid}`;
	return user;
}
