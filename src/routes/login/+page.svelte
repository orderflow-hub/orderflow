<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { authHandlers } from '../../stores/authStore';
	import * as Form from '$lib/components/ui/form';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';
	import { loginFormSchema } from '$lib/schemas/loginFormSchema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(loginFormSchema),
		resetForm: false,
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message) {
				if (form.message.status === 'success') {
					handleLogin(); // Login with the validated credentials
				} else {
					toast.error(form.message.text);
				}
			}
		}
	});

	const { form: formData, enhance } = form;

	async function handleLogin() {
		try {
			await authHandlers.login($formData.email, $formData.password);

			window.location.href = '/';

			toast.success('Επιτυχής σύνδεση');
		} catch (error) {
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
		<form method="POST" class="flex flex-col gap-8" use:enhance>
			<div class="flex flex-col items-start justify-center gap-4 self-stretch rounded-lg">
				<Form.Field class="flex w-full flex-col" {form} name="email">
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} bind:value={$formData.email} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field class="flex w-full flex-col" {form} name="password">
					<Form.Control let:attrs>
						<Form.Label>Κωδικός</Form.Label>
						<Input {...attrs} type="password" bind:value={$formData.password} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="flex flex-col items-stretch justify-center">
				<Button type="submit">Σύνδεση</Button>
			</div>
		</form>
	</div>
</div>
