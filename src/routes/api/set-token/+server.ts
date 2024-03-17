import { verifyToken } from '$lib/firebaseAdmin';
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
