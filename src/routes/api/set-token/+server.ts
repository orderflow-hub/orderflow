import { verifyToken } from '$lib/firebaseAdmin';

/* API Endpoint: /api/set-token
 * Method: POST
 * Description: Sets the idToken in an HTTP-only cookie
 * Request: { token: string }
 * Response: { message: string }
 *
 * Once the user logs in using firebase-client, the token is sent to this endpoint
 * and set in an HTTP-only cookie for added security. The cookie is then sent with
 * every request to the server, allowing the server to verify the user's identity
 * by checking the validity of the token using firebase-admin.
 */
export async function POST({ request }: { request: Request }) {
	const { token } = await request.json();

	// Verify the token using Firebase Admin SDK for added security
	if ((await verifyToken(token)) === null) {
		return new Response(
			JSON.stringify({
				message: 'Token verification failed'
			}),
			{
				status: 401
			}
		);
	}

	// Set the HTTP-only cookie with the token
	const headers = new Headers({
		'Set-Cookie': `idToken=${token}; Path=/; HttpOnly; SameSite=Strict`
	});

	return new Response(
		JSON.stringify({
			message: 'Token set in cookie'
		}),
		{
			status: 200,
			headers: headers
		}
	);
}
