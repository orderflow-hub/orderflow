<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { ArrowLeft, Trash, CircleAlert } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import { goto } from '$app/navigation';

	// Get customer data from the server to populate the fields
	export let data;
	let { customer } = data;

	if (customer === undefined) {
		throw new Error('Customer not found');
	}

	// Handle the confirmation dialog for deleting the customer
	let isDialogOpen = false;
	function setIsDialogOpen(isOpen: boolean) {
		isDialogOpen = isOpen;
	}

	// Delete the customer from the database and show a toast notification. Redirect to '/customers' page if successful
	async function handleDelete() {
		const response = await fetch(`/api/customers/${customer?.user_id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			toast.success('Ο πελάτης διαγράφηκε επιτυχώς');
			isDialogOpen = false;
			goto('/customers'); // Redirect to '/customers' page
		} else {
			toast.error('Υπήρξε πρόβλημα κατά τη διαγραφή του πελάτη');
		}
	}

	// Save the customer detail changes to the database and show a toast notification
	async function handleSave() {
		// TODO: Field validation and maybe only send the fields that have changed
		const response = await fetch(`/api/customers/${customer?.user_id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(customer)
		});

		if (response.ok) {
			toast.success('Οι αλλαγές αποθηκεύτηκαν επιτυχώς');
		} else {
			toast.error('Υπήρξε πρόβλημα κατά την αποθήκευση των αλλαγών');
		}
	}
</script>

<div class="flex flex-col items-start items-stretch justify-center gap-2.5 rounded-lg p-2.5">
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
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="customer-company-name">Επωνυμία</Label>
				<Input
					type="text"
					id="customer-company-name"
					placeholder=""
					bind:value={customer.company_name}
				/>
			</div>
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="customer-code">Κωδικός πελάτη</Label>
				<Input type="text" id="customer-code" placeholder="" bind:value={customer.user_code} />
			</div>
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="email">Email</Label>
				<Input type="email" id="email" placeholder="" bind:value={customer.email} />
			</div>
			<div class="flex gap-3">
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="phone">Τηλέφωνο</Label>
					<Input type="tel" id="phone" placeholder="" bind:value={customer.phone_number} />
				</div>
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="afm">ΑΦΜ</Label>
					<Input type="text" id="afm" placeholder="" bind:value={customer.afm} />
				</div>
			</div>
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="street-address">Διεύθυνση</Label>
				<Input
					type="text"
					id="street-address"
					placeholder=""
					bind:value={customer.street_address}
				/>
			</div>
			<div class="mb-3 flex gap-3">
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="city">Πόλη</Label>
					<Input type="text" id="city" placeholder="" bind:value={customer.city} />
				</div>
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="postal-code">Τ.Κ.</Label>
					<Input type="text" id="postal-code" placeholder="" bind:value={customer.postal_code} />
				</div>
			</div>
			<div class="items-top mb-3 flex space-x-2">
				<Checkbox
					id="is-account-disabled"
					class="border-input data-[state=checked]:bg-destructive"
					bind:checked={customer.is_account_disabled}
				/>
				<Label
					for="is-account-disabled"
					class="text-md flex flex-col gap-1.5 font-medium leading-none leading-none text-destructive peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					<span>Απενεργοποίηση λογαριασμού</span>
					<p class="text-xs text-muted-foreground">
						Ο πελάτης δε θα μπορεί να συνδεθεί στο σύστημα όσο ο λογαριασμός του παραμένει
						απενεργοποιημένος. Τα στοιχεία του παραμένουν στο σύστημα και εμφανίζονται στο ιστορικό
						των παραγγελιών.
					</p>
				</Label>
			</div>
		</div>
		<Button variant="default" class="text-base font-normal" on:click={handleSave}>Αποθήκευση</Button
		>
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
