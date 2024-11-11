<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { ArrowLeft, Trash, CircleAlert } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import { goto } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import customersStore from '../../../stores/customersStore';
	import { formCustomerSchema } from '$lib/schemas/customerSchema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	// Get customer data from the server to populate the fields
	export let data;

	let { customer } = data;
	if (customer === undefined) {
		throw new Error('Customer not found');
	}

	if (!data.form) {
		throw new Error('Form data is not provided');
	}

	const form = superForm(data.form, {
		validators: zodClient(formCustomerSchema),
		resetForm: false,
		onUpdated({ form }) {
			if (form.message) {
				if (form.message.status === 'success') {
					toast.success(form.message.text);

					customersStore.updateCustomer(form.message.updatedCustomer);

					// Redirect to '/customers' page
					goto('/customers');
				} else {
					toast.error(form.message.text);
				}
			}
		}
	});

	const { form: formData, enhance } = form;

	// Handle the confirmation dialog for deleting the customer
	let isDialogOpen = false;
	function setIsDialogOpen(isOpen: boolean) {
		isDialogOpen = isOpen;
	}

	// Delete the customer from the database and show a toast notification. Redirect to '/customers' page if successful
	async function handleDelete() {
		const response = await fetch(`/api/customers/${customer?.userId}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			toast.success('Ο πελάτης διαγράφηκε επιτυχώς');

			isDialogOpen = false;

			// Filters deleted product from the store.
			let filteredCustomers = $customersStore.filter(
				(customer) => customer.userId !== $formData.customerId
			);
			customersStore.setCustomers(filteredCustomers, true);

			// Redirect to '/customers' page
			goto('/customers');
		} else {
			toast.error('Υπήρξε πρόβλημα κατά τη διαγραφή του πελάτη');
		}
	}
</script>

<div class="flex flex-col items-stretch justify-center gap-2.5 rounded-lg p-2.5">
	{#if customer}
		<div class="flex w-full items-center gap-3">
			<a href="/customers" class="p-1">
				<ArrowLeft />
			</a>
			<div class="flex shrink grow items-center">
				<h1 class="text-base font-normal text-zinc-700">Επεξεργασία πελάτη</h1>
			</div>
			<Button variant="ghost" size="icon" on:click={() => setIsDialogOpen(true)}>
				<Trash class="h-5 w-5" />
			</Button>
		</div>
		<div class="flex flex-col items-start justify-center gap-4 self-stretch rounded-lg p-2.5">
			<form method="POST" action="?/editCustomer" use:enhance>
				<!-- Hidden field for the customer ID -->
				<Form.Field {form} name="customerId">
					<Form.Control let:attrs>
						<Input {...attrs} bind:value={$formData.customerId} type="hidden" />
					</Form.Control>
				</Form.Field>
				<div class="flex flex-col items-start justify-center gap-2.5 self-stretch rounded-lg">
					<Form.Field class="flex w-full max-w-sm flex-col" {form} name="companyName">
						<Form.Control let:attrs>
							<Form.Label>Επωνυμία *</Form.Label>
							<Input {...attrs} bind:value={$formData.companyName} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field class="flex w-full max-w-sm flex-col" {form} name="userCode">
						<Form.Control let:attrs>
							<Form.Label>Κωδικός πελάτη *</Form.Label>
							<Input {...attrs} disabled bind:value={$formData.userCode} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field class="flex w-full max-w-sm flex-col" {form} name="email">
						<Form.Control let:attrs>
							<Form.Label>Email *</Form.Label>
							<Input {...attrs} bind:value={$formData.email} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<div class="flex w-full gap-3">
						<Form.Field class="flex w-full max-w-sm flex-col" {form} name="phoneNumber">
							<Form.Control let:attrs>
								<Form.Label>Τηλέφωνο *</Form.Label>
								<Input {...attrs} bind:value={$formData.phoneNumber} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field class="flex w-full max-w-sm flex-col" {form} name="afm">
							<Form.Control let:attrs>
								<Form.Label>ΑΦΜ *</Form.Label>
								<Input {...attrs} bind:value={$formData.afm} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<Form.Field class="flex w-full max-w-sm flex-col" {form} name="streetAddress">
						<Form.Control let:attrs>
							<Form.Label>Διεύθυνση</Form.Label>
							<Input {...attrs} bind:value={$formData.streetAddress} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<div class="flex w-full gap-3">
						<Form.Field class="flex w-full max-w-sm flex-col" {form} name="city">
							<Form.Control let:attrs>
								<Form.Label>Πόλη</Form.Label>
								<Input {...attrs} bind:value={$formData.city} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>

						<Form.Field class="flex w-full max-w-sm flex-col" {form} name="postalCode">
							<Form.Control let:attrs>
								<Form.Label>Τ.Κ.</Form.Label>
								<Input {...attrs} bind:value={$formData.postalCode} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<Form.Field {form} name="isAccountDisabled" class="items-top mb-3 flex space-x-2">
						<Form.Control let:attrs>
							<Checkbox
								{...attrs}
								bind:checked={$formData.isAccountDisabled}
								class="mt-2 border-input data-[state=checked]:bg-destructive"
								id="is-account-disabled"
							/>
							<Form.Label
								for="is-account-disabled"
								class="text-md flex flex-col gap-1.5 font-medium leading-none text-destructive peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>Απενεργοποίηση λογαριασμού
								<Form.Description class="text-xs text-muted-foreground">
									Ο πελάτης δε θα μπορεί να συνδεθεί στο σύστημα όσο ο λογαριασμός του παραμένει
									απενεργοποιημένος. Τα στοιχεία του παραμένουν στο σύστημα και εμφανίζονται στο
									ιστορικό των παραγγελιών.
								</Form.Description>
							</Form.Label>
							<input name={attrs.name} value={$formData.isAccountDisabled} hidden />
						</Form.Control>
					</Form.Field>
					<Button variant="default" class="w-full text-base font-normal" type="submit"
						>Αποθήκευση</Button
					>
				</div>
			</form>
		</div>
	{/if}
</div>

<!-- Confirmation dialog to prevent the user from accidentally deleting the customer -->
<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Trigger />
	<Dialog.Content class="flex flex-col items-start">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2.5 border-b pb-2.5"
				><CircleAlert />Διαγραφή πελάτη</Dialog.Title
			>
			<Dialog.Description class="text-left">
				Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτόν τον πελάτη; Αυτή η ενέργεια δεν μπορεί να
				αναιρεθεί.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="secondary" on:click={() => setIsDialogOpen(false)}>Ακύρωση</Button>
			<Button variant="destructive" on:click={handleDelete}>Διαγραφή</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
