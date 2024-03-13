import postgres from 'postgres';

declare global {
	namespace App {
		interface User {
			uid: string;
			role: string;
		}

		interface Locals {
			user: User;
			sql: ReturnType<typeof postgres>;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
