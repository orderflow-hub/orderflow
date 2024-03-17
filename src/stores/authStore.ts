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

export const authStore = writable<AuthState>({
	currentUser: null,
	idToken: ''
});

export const authHandlers = {
	login: async (email: string, password: string) => {
		await signInWithEmailAndPassword(auth, email, password);
		const user = auth.currentUser;
		const token = user && (await user.getIdToken());
		if (token) {
			authStore.set({ currentUser: user, idToken: token });
			await fetch('/api/set-token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ token })
			});
		}
	},
	// signup: async (email: string, passord: string) => {
	// 	await createUserWithEmailAndPassword(auth, email, passord);
	// },
	logout: async () => {
		await signOut(auth);
	},
	// resetPassword: async (email: string) => {
	// 	await sendPasswordResetEmail(auth, email);
	// },
	// updateEmail: async (email: string) => {
	// 	const currentUser = auth.currentUser;
	// 	if (currentUser) {
	// 		await updateEmail(currentUser, email);
	// 	}
	// },
	updatePassword: async (password: string) => {
		const currentUser = auth.currentUser;
		if (currentUser) {
			await updatePassword(currentUser, password);
		}
	},
	reauthenticateWithCredential: async (credential: AuthCredential) => {
		const currentUser = auth.currentUser;
		if (currentUser) {
			await reauthenticateWithCredential(currentUser, credential);
		}
	}
};
