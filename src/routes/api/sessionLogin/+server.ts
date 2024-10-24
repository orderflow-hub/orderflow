import type { RequestHandler } from '@sveltejs/kit';
import { authAdmin } from '$lib/firebaseAdmin'; // Adjust the path to your firebaseAdmin setup

/* API Endpoint: /api/sessionLogin
 * Method: POST
 * Description: Creates and sets an HTTP-only session cookie
 * Request: { token: string }
 * Response: { message: string }
 *
 * Once the user logs in using firebase-client, the token is sent to this endpoint
 * and is used to create a session cookie. The cookie is then sent with
 * every request to the server, allowing the server to verify the user's identity
 * by checking the validity of the session cookie using firebase-admin.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { token } = await request.json(); // Obtain ID token from the client

	try {
		const expiresIn = 14 * 60 * 60 * 24 * 1000; // Minimum 5 minutes and maximum 14 days in milliseconds

		// Create a session cookie from the ID token
		const sessionCookie = await authAdmin.createSessionCookie(token, { expiresIn });

		// Set the HTTP-only session cookie
		return new Response(
			JSON.stringify({
				message: 'Session cookie set'
			}),
			{
				status: 200,
				headers: {
					'Set-Cookie': `session=${sessionCookie}; Path=/; HttpOnly; Secure; Max-Age=${expiresIn / 1000};`
				}
			}
		);
	} catch (error) {
		console.error('Error setting session cookie', error);
		return new Response(
			JSON.stringify({
				message: 'Error setting session cookie'
			}),
			{ status: 401 }
		);
	}
};
