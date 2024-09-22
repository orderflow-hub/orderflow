<script>
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';
	import { customerSchema } from '$lib/schemas/customerSchema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	// Get customer data to populate the fields
	export let data;

	let { customer } = data;
	if (customer === undefined) {
		throw new Error('Customer not found');
	}

	if (!data.form) {
		throw new Error('Form data is not provided');
	}

	const form = superForm(data.form, {
		validators: zodClient(customerSchema),
		resetForm: false,
		onUpdated({ form }) {
			if (form.message) {
				if (form.message.status === 'success') {
					toast.success(form.message.text);
				} else {
					toast.error(form.message.text);
				}
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex items-start justify-center rounded-lg">
	<!-- Temporarily disabled, since use:enhance cannot be used on a form without a POST request -->
	<!-- <form use:enhance> -->
	 <form>
		<div class="flex flex-col items-start justify-center gap-2.5 self-stretch rounded-lg">
			<Form.Field class="flex w-full max-w-sm flex-col" {form} name="companyName">
				<Form.Control let:attrs>
					<Form.Label>Επωνυμία</Form.Label>
					<Input {...attrs} bind:value={$formData.companyName} disabled />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field class="flex w-full max-w-sm flex-col" {form} name="userCode">
				<Form.Control let:attrs>
					<Form.Label>Κωδικός πελάτη</Form.Label>
					<Input {...attrs} bind:value={$formData.userCode} disabled />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field class="flex w-full max-w-sm flex-col" {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} bind:value={$formData.email} disabled autocomplete="false" />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex w-full gap-3">
				<Form.Field class="flex w-full max-w-sm flex-col" {form} name="phoneNumber">
					<Form.Control let:attrs>
						<Form.Label>Τηλέφωνο</Form.Label>
						<Input {...attrs} bind:value={$formData.phoneNumber} disabled />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field class="flex w-full max-w-sm flex-col" {form} name="afm">
					<Form.Control let:attrs>
						<Form.Label>ΑΦΜ</Form.Label>
						<Input {...attrs} bind:value={$formData.afm} disabled />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Form.Field class="flex w-full max-w-sm flex-col" {form} name="streetAddress">
				<Form.Control let:attrs>
					<Form.Label>Διεύθυνση</Form.Label>
					<Input {...attrs} bind:value={$formData.streetAddress} disabled />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex w-full gap-3">
				<Form.Field class="flex w-full max-w-sm flex-col" {form} name="city">
					<Form.Control let:attrs>
						<Form.Label>Πόλη</Form.Label>
						<Input {...attrs} bind:value={$formData.city} disabled />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field class="flex w-full max-w-sm flex-col" {form} name="postalCode">
					<Form.Control let:attrs>
						<Form.Label>Τ.Κ.</Form.Label>
						<Input {...attrs} bind:value={$formData.postalCode} disabled />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
		</div>
	</form>
</div>
