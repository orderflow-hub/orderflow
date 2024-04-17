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

/**
 * Creates a new user in Firebase Authentication using firebase-admin.
 *
 * @param {string} email The email of the user to be created.
 * @param {string} password The password for the new user.
 * @returns {Promise<admin.auth.UserRecord | null>} A promise that resolves to the UserRecord (contains the user data) for the newly created user on success, or null on failure.
 * @throws {Error} If an error occurs while creating the user, the error is logged to the console and the function returns null.
 */
export async function createUser(
	email: string,
	password: string
): Promise<admin.auth.UserRecord | null> {
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

/**
 * Updates the email of a user in Firebase Authentication using firebase-admin.
 *
 * @param {string} uid The Firebase unique identifier of the user whose email is to be updated.
 * @param {string} email The new email for the user.
 * @returns {Promise<boolean>} A promise that resolves to true if the email was successfully updated, or false if an error occurred.
 * @throws {Error} If an error occurs while updating the email, the error is logged to the console and the function returns false.
 */
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

/**
 * Deletes a user from Firebase Authentication using firebase-admin.
 *
 * @param {string} uid The Firebase unique identifier of the user to be deleted.
 * @returns {Promise<boolean>} A promise that resolves to true if the user was successfully deleted, or false if an error occurred.
 * @throws {Error} If an error occurs while deleting the user, the error is logged to the console and the function returns false.
 */
export async function deleteUser(uid: string): Promise<boolean> {
	try {
		await authAdmin.deleteUser(uid);
		return true;
	} catch (error) {
		console.error('Error deleting user:', error);
		return false;
	}
}
