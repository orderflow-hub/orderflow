/* API Endpoint: /api/logout
 * Method: POST
 * Description: Logs the user out by clearing the idToken cookie
 * Request: None
 * Response: { message: string }
 */
export async function POST() {
	// Set the cookie to expire immediately
	const headers = new Headers({
		'Set-Cookie': `idToken=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
	});

	// Return a response indicating successful logout
	return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
		status: 200,
		headers: headers
	});
}
