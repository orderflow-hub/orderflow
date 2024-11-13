// File containing helper functions to enforce authentication and authorization

import { parse } from 'cookie';
import { authAdmin } from '$lib/firebaseAdmin';
import sql from '$lib/db';

/**
 * Extracts the Firebase UID from a request's session cookie if it is valid
 * @param request
 * @returns The Firebase UID of the user if the request contains a valid session cookie, otherwise undefined
 */
export const getFirebaseUidFromCookie = async (request: Request): Promise<string | undefined> => {
	// Parse the cookies from the request and extract the session cookie
	const cookies = parse(request.headers.get('cookie') ?? '');
	const session = cookies.session;

	if (session) {
		try {
			// Verify the session cookie via firebase-admin to ensure it's valid and has not been tampered with or expired
			const decodedToken = await authAdmin.verifySessionCookie(session, true);
			if (decodedToken) {
				return decodedToken.uid;
			}
		} catch (error) {
			// Optionally handle token verification failure
			console.error('Token verification failed:', error);
		}
	}

	return undefined;
};

/**
 * Gets the `user_id` of the user associated with the Firebase UID.
 * @param request The request object from which the Firebase UID is extracted
 * @returns The `user_id` used to reference the user in the database
 */
export const getUserId = async (request: Request): Promise<number | undefined> => {
	const firebaseUid = await getFirebaseUidFromCookie(request);

	if (!firebaseUid) return undefined;

	try {
		// Query the database to get the user_id
		const [res] = await sql`SELECT user_id FROM users WHERE firebase_uid = ${firebaseUid}`;
		return res.user_id;
	} catch (error) {
		console.error('Failed to get user_id:', error);
		return undefined;
	}
};
