<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { authHandlers } from '$stores/authStore';
	import { toast } from 'svelte-sonner';

	let email = '';
	let password = '';
	export let form; // Used for form errors returned from the schema

	async function handleLogin(email: string, password: string) {
		try {
			await authHandlers.login(email, password);
			window.location.href = '/'; // Redirect to homepage on successful login
			// toast.success('Επιτυχής σύνδεση');
		} catch (error) {
			// Display the specific error message
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('Άγνωστο σφάλμα');
			}
		}
	}

	// Runs handleLogin when form data is inserted correctly
	if (form?.success) {
		email = form.data.email.toString();
		password = form.data.password.toString();
		handleLogin(email, password);
	}

	// Check if form contains any data (e.g., from a failed validation) and pre-fill inputs
	if (form?.data) {
		email = form.data.email.toString() || ''; // Persist email if validation fails
	}
</script>

<div class="flex h-full w-full justify-center">
	<div class="flex w-full max-w-md flex-col justify-center gap-8 p-2.5">
		<div class="pt-4 text-center text-5xl font-extrabold text-zinc-700">OrderFlow</div>
		<form method="POST" class="flex flex-col gap-8" novalidate>
			<div class="flex flex-col items-start justify-center gap-4 self-stretch rounded-lg">
				<div class="flex w-full flex-col gap-1.5">
					<Label for="email">Email</Label>
					<Input type="email" id="email" name="email" placeholder="" bind:value={email} required />
					{#if form?.errors?.email}
						<span class="text-sm text-red-600">{form?.errors?.email[0]}</span>
					{/if}
				</div>
				<div class="flex w-full flex-col gap-1.5">
					<Label for="password">Κωδικός</Label>
					<Input
						type="password"
						id="password"
						name="password"
						placeholder=""
						bind:value={password}
						required
					/>
					{#if form?.errors?.password}
						<span class="text-sm text-red-600">{form?.errors?.password[0]}</span>
					{/if}
				</div>
			</div>
			<div class="flex flex-col items-stretch justify-center">
				<Button type="submit">Σύνδεση</Button>
			</div>
		</form>
	</div>
</div>
