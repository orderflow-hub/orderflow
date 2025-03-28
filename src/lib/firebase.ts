import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let firebaseApp;

// If the app is not already initialized, initialize it
if (!getApps().length) {
	firebaseApp = initializeApp(firebaseConfig);
}

export const auth = getAuth(firebaseApp);
