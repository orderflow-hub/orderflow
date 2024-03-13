// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import { verifyToken } from '$lib/firebaseAdmin';
import sql from '$lib/db';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = parse(event.request.headers.get('cookie') ?? '');
	const idToken = cookies.idToken;

	// Add the database client to locals
	event.locals.sql = sql;

	if (idToken) {
		try {
			const decodedToken = await verifyToken(idToken);
			if (decodedToken) {
				const uid = decodedToken.uid;
				const userRole = await getUserRoleFromDatabase(uid);
				if (userRole) {
					event.locals.user = { uid, role: userRole };
				} else {
					console.error('User role is null');
					// Handle the case when user role is null
				}
			} else {
				console.error('UID is null');
				// Handle the case when UID is null
			}
		} catch (error) {
			console.error('Token verification failed:', error);
			// Optionally handle token verification failure
		}
	}

	const response = await resolve(event);
	return response;
};

async function getUserRoleFromDatabase(uid: string) {
	const userRole = await sql`SELECT role FROM users WHERE firebase_uid = ${uid}`;
	return userRole[0].role;
}
