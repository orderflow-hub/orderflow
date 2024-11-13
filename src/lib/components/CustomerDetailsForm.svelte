<script lang="ts">
	import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formCustomerSchema, type FormCustomerSchema } from '$lib/schemas/customerSchema';

	// Get customer data to populate the fields
	export let customerDetailsForm: SuperValidated<Infer<FormCustomerSchema>>;

	if (!customerDetailsForm) {
		throw new Error('Form data is not provided');
	}

	const form = superForm(customerDetailsForm, {
		validators: zodClient(formCustomerSchema),
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

<!-- Disabled, since use:enhance cannot be used on a form without a POST request -->
<!-- <form use:enhance> -->
<form>
	<div class="flex flex-col items-start justify-center gap-2.5 self-stretch rounded-md">
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
				<Input {...attrs} bind:value={$formData.email} disabled />
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
