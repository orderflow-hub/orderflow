<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { authHandlers, authStore } from '../../stores/authStore';
	import { toast } from 'svelte-sonner';

	let email = '';
	let password = '';

	async function handleLogin() {
        try {
            await authHandlers.login(email, password);
            window.location.href = '/'; // Redirect to homepage on successful login
        } catch (error) {
            // Display the specific error message
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Άγνωστο σφάλμα');
            }
        }
    }
</script>

<div class="flex h-full w-full justify-center">
	<div class="flex w-full max-w-md flex-col justify-center gap-8 p-2.5">
		<div class="pt-4 text-center text-5xl font-extrabold text-zinc-700">OrderFlow</div>
		<form class="flex flex-col gap-8" on:submit|preventDefault={handleLogin}>
			<div class="flex flex-col items-start justify-center gap-4 self-stretch rounded-lg">
				<div class="flex w-full flex-col gap-1.5">
					<Label for="email">Email</Label>
					<Input type="email" id="email" placeholder="" bind:value={email} required />
				</div>
				<div class="flex w-full flex-col gap-1.5">
					<Label for="password">Κωδικός</Label>
					<Input type="password" id="password" placeholder="" bind:value={password} required />
				</div>
			</div>
			<div class="flex flex-col items-stretch justify-center">
				<Button type="submit">Σύνδεση</Button>
			</div>
		</form>
	</div>
</div>
