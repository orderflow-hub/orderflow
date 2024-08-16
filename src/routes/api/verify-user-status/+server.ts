import type { RequestHandler } from '@sveltejs/kit';
import { verifyToken } from '$lib/firebaseAdmin'; // Import your token verification function
import sql from '$lib/db';

export const POST: RequestHandler = async ({ request }) => {
    const { token } = await request.json();

    if (!token) {
        return new Response('No token provided', { status: 401 });
    }

    try {
        // Verify the token
        const decodedToken = await verifyToken(token);
        const uid = decodedToken.uid;

        // Check if the user is disabled in the database
        const isAccountDisabled = await getIsAccountDisabledFromDatabase(uid);
        
        return new Response(
            JSON.stringify({ is_account_disabled: isAccountDisabled }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response('Token verification failed', { status: 401 });
    }
};

// This function queries the database to get the user's role based on their UID retrieved from the verified user's firebase ID token
async function getIsAccountDisabledFromDatabase(uid: string) {
	const isAccountDisabled = await sql`SELECT is_account_disabled FROM users WHERE firebase_uid = ${uid}`;
	return isAccountDisabled[0].is_account_disabled;
}