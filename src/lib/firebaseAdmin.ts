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

export async function createUser(email: string, password: string) {
	try {
		const userRecord = await authAdmin.createUser({
			email: email,
			password: password
		});
		return userRecord;
	} catch (error) {
		console.error('Error creating user:', error);
		return null;
	}
}

export async function updateEmail(uid: string, email: string): Promise<boolean> {
	try {
		await authAdmin.updateUser(uid, {
			email: email
		});
		return true;
	} catch (error) {
		console.error('Error updating email:', error);
		return false;
	}
}

export async function deleteUser(uid: string): Promise<boolean> {
	try {
		await authAdmin.deleteUser(uid);
		return true;
	} catch (error) {
		console.error('Error deleting user:', error);
		return false;
	}
}
