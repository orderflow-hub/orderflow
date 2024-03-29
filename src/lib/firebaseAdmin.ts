import admin from 'firebase-admin';
import { FIREBASE_SERVICE_ACCOUNT } from '$env/static/private';

// Initialize the admin app
const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);

// If the app is not already initialized, initialize it
if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount)
	});
}

export const authAdmin = admin.auth();

// This function verifies the user's firebase ID token and returns the decoded token if it's valid
export async function verifyToken(token: string) {
	try {
		return await authAdmin.verifyIdToken(token);
	} catch (error) {
		console.error('Error verifying token:', error);
		return null;
	}
}
