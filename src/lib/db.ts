import postgres from 'postgres';
// import { DATABASE_URL } from '$env/static/private';

// Access the DATABASE_URL from the environment variables at runtime
const databaseUrl: string | undefined = process.env.DATABASE_URL;

// Ensure that the variable being passed is always a string
if (!databaseUrl) {
	throw new Error('DATABASE_URL is not defined');
}

// Create a new connection to the database
const sql = postgres(databaseUrl);

// Export the connection to be used in hooks.server.ts
export default sql;
