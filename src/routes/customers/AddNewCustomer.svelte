<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { customerSchema } from '$lib/schemas/customerSchema';
	import type { Customer } from '$lib/types';
	import { toast } from 'svelte-sonner';
	import customersStore from '../../stores/customersStore';


	// export let data: SuperValidated<Infer<FormCustomerSchema>>;
	export let data;

	const form = superForm(data.form, {
		validators: zodClient(customerSchema),
		resetForm: false,
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message) {
				if (form.message.status === 'success') {
					toast.success(form.message.text);
					console.log(form);

					// Adds new Customer to Store
					const customer: Customer = {
						user_id: form.message.userId,
						company_name: $formData.companyName,
						user_code: $formData.userCode,
						email: $formData.email,
						phone_number: $formData.phoneNumber,
						afm: $formData.afm,
						street_address: $formData.streetAddress,
						city: $formData.city,
						postal_code: $formData.postalCode,
						is_account_disabled: $formData.isDisabled
					};
					customersStore.setCustomers([customer], false);
					
					// Hides form modal.
					isDialogOpen = false;
				} else {
					toast.error(form.message.text);
				}
			}
		}
	});

	const { form: formData, enhance } = form;

	let isDialogOpen = false;
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Trigger class="text-base font-normal">
		<Button class="w-10 grow-0 border bg-transparent p-0 text-muted-foreground">
			<Plus />
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header class="mb-2.5">
			<Dialog.Title>Προσθήκη νέου πελάτη</Dialog.Title>
		</Dialog.Header>
		<form method="POST" action="?/createCustomer" use:enhance>
			<div class="flex flex-col items-start justify-center gap-2.5 self-stretch rounded-lg">
				<Form.Field class="flex w-full max-w-sm flex-col gap-1.5" {form} name="companyName">
					<Form.Control let:attrs>
						<Form.Label>Επωνυμία *</Form.Label>
						<Input {...attrs} bind:value={$formData.companyName} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field class="flex w-full max-w-sm flex-col gap-1.5" {form} name="userCode">
					<Form.Control let:attrs>
						<Form.Label>Κωδικός πελάτη *</Form.Label>
						<Input {...attrs} bind:value={$formData.userCode} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field class="flex w-full max-w-sm flex-col gap-1.5" {form} name="email">
					<Form.Control let:attrs>
						<Form.Label>Email *</Form.Label>
						<Input {...attrs} bind:value={$formData.email} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<div class="flex w-full gap-3">
					<Form.Field class="flex w-full max-w-sm flex-col gap-1.5" {form} name="phoneNumber">
						<Form.Control let:attrs>
							<Form.Label>Τηλέφωνο *</Form.Label>
							<Input {...attrs} bind:value={$formData.phoneNumber} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field class="flex w-full max-w-sm flex-col gap-1.5" {form} name="afm">
						<Form.Control let:attrs>
							<Form.Label>ΑΦΜ *</Form.Label>
							<Input {...attrs} bind:value={$formData.afm} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<Form.Field class="flex w-full max-w-sm flex-col gap-1.5" {form} name="streetAddress">
					<Form.Control let:attrs>
						<Form.Label>Διεύθυνση</Form.Label>
						<Input {...attrs} bind:value={$formData.streetAddress} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<div class="flex w-full gap-3">
					<Form.Field class="flex w-full max-w-sm flex-col gap-1.5" {form} name="city">
						<Form.Control let:attrs>
							<Form.Label>Πόλη</Form.Label>
							<Input {...attrs} bind:value={$formData.city} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field class="flex w-full max-w-sm flex-col gap-1.5" {form} name="postalCode">
						<Form.Control let:attrs>
							<Form.Label>Τ.Κ.</Form.Label>
							<Input {...attrs} bind:value={$formData.postalCode} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</div>
			<Dialog.Footer>
				<Button variant="secondary" on:click={() => (isDialogOpen = false)}>Ακύρωση</Button>
				<Button type="submit">Προσθήκη</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
