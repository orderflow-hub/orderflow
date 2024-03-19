import { writable } from 'svelte/store';
import { auth } from '$lib/firebase';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	sendPasswordResetEmail,
	updateEmail,
	updatePassword,
	reauthenticateWithCredential
} from 'firebase/auth';
import type { User, AuthCredential } from 'firebase/auth';

type AuthState = {
	currentUser: User | null;
	idToken: string;
};

// Create a writable store to hold the user's authentication state
// This store is used client-side to keep track of the user's authentication state
export const authStore = writable<AuthState>({
	currentUser: null,
	idToken: ''
});

// Custom authHandler functions that make use of various authentication methods
// provided by firebase-client
export const authHandlers = {
	// Login using email and password
	login: async (email: string, password: string) => {
		// Call firebase-client's signInWithEmailAndPassword method
		await signInWithEmailAndPassword(auth, email, password);
		const user = auth.currentUser;
		const token = user && (await user.getIdToken());
		if (token) {
			// If the user is logged in, set the currentUser and idToken in the authStore
			authStore.set({ currentUser: user, idToken: token });
			// And then set the token in the server
			await fetch('/api/set-token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ token })
			});
		}
	},
	// Singup using email and password (DISABLED)
	// signup: async (email: string, passord: string) => {
	// 	await createUserWithEmailAndPassword(auth, email, passord);
	// },
	// Logout
	logout: async () => {
		await signOut(auth);
	},
	// Send password reset email (DISABLED)
	// resetPassword: async (email: string) => {
	// 	await sendPasswordResetEmail(auth, email);
	// },
	// Update email (DISABLED)
	// updateEmail: async (email: string) => {
	// 	const currentUser = auth.currentUser;
	// 	if (currentUser) {
	// 		await updateEmail(currentUser, email);
	// 	}
	// },
	// Update password
	updatePassword: async (password: string) => {
		const currentUser = auth.currentUser;
		if (currentUser) {
			await updatePassword(currentUser, password);
		}
	},
	// Reauthenticate with credential. Used before updating the user's password
	reauthenticateWithCredential: async (credential: AuthCredential) => {
		const currentUser = auth.currentUser;
		if (currentUser) {
			await reauthenticateWithCredential(currentUser, credential);
		}
	}
};
