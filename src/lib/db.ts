import postgres from 'postgres';
import { DATABASE_URL } from '$env/static/private';

// Create a new connection to the database
const sql = postgres(DATABASE_URL);

// Export the connection to be used in hooks.server.ts
export default sql;
