<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Image } from 'lucide-svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { ArrowLeft, Trash, CircleAlert } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import { goto } from '$app/navigation';

	// Get product data from the server to populate the fields
	export let data;
	let { product } = data;

	if (product === undefined) {
		throw new Error('Product not found');
	}

	// Handle the confirmation dialog for deleting the product
	let isDialogOpen = false;
	function setIsDialogOpen(isOpen: boolean) {
		isDialogOpen = isOpen;
	}

	// Delete the product from the database and show a toast notification. Redirect to '/products' page if successful
	async function handleDelete() {
		const response = await fetch(`/api/products/${product?.product_id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			toast.success('Το προϊόν διαγράφηκε επιτυχώς');
			isDialogOpen = false;
			goto('/products'); // Redirect to '/products' page
		} else {
			toast.error('Υπήρξε πρόβλημα κατά τη διαγραφή του προϊόντος');
		}
	}

	// Save the product detail changes to the database and show a toast notification
	async function handleSave() {
		// TODO: Field validation and maybe only send the fields that have changed
		const response = await fetch(`/api/products/${product?.product_id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(product)
		});

		if (response.ok) {
			toast.success('Οι αλλαγές αποθηκεύτηκαν επιτυχώς');
		} else {
			toast.error('Υπήρξε πρόβλημα κατά την αποθήκευση των αλλαγών');
		}
	}

	// Reactive statement to determine the default sale unit selection
	$: defaultSelection =
		product?.sale_unit === 'piece'
			? { value: 'piece', label: 'τεμάχιο' }
			: { value: 'kg', label: 'kg' };
</script>

<div class="flex flex-col items-start items-stretch justify-center gap-2.5 rounded-lg p-2.5">
	{#if product}
		<div class="flex w-full items-center gap-3">
			<a href="/products" class="p-1">
				<ArrowLeft />
			</a>
			<div class="flex shrink grow items-center">
				<h1 class="text-base font-normal text-zinc-700">Επεξεργασία προϊόντος</h1>
			</div>
			<Button variant="ghost" size="icon" on:click={() => setIsDialogOpen(true)}>
				<Trash class="h-5 w-5" />
			</Button>
		</div>
		<div class="flex flex-col items-start justify-center gap-4 rounded-lg">
			{#if product.image_url}
				<div class="h-24 rounded-md border p-2">
					<img
						class="aspect-square h-full object-cover"
						src={product.image_url}
						alt="Εικόνα προϊόντος"
					/>
				</div>
			{:else}
				<Image class="rounded-md border" strokeWidth={1} size={80} />
			{/if}
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="product-name">Όνομα προϊόντος</Label>
				<Input
					type="text"
					id="product-name"
					placeholder=""
					bind:value={product.product_name}
					required
				/>
			</div>
			<div class="mb-3 flex w-full max-w-sm gap-3">
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="product-code">Κωδικός προϊόντος</Label>
					<Input
						type="text"
						id="product-code"
						placeholder=""
						bind:value={product.product_code}
						required
					/>
				</div>
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="sale-unit">Μονάδα μέτρησης</Label>
					<Select.Root required selected={defaultSelection}>
						<Select.Trigger>
							<Select.Value placeholder="Κιλό/Τεμ" />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="kg">kg</Select.Item>
							<Select.Item value="piece">τεμάχιο</Select.Item>
						</Select.Content>
						<Select.Input id="sale-unit" />
					</Select.Root>
				</div>
			</div>
			<div class="items-top mb-3 flex space-x-2">
				<Checkbox
					id="isAvailable"
					class="border-input data-[state=checked]:bg-destructive"
					bind:checked={product.is_available}
				/>
				<Label
					for="isAvailable"
					class="text-md flex flex-col gap-1.5 font-medium leading-none leading-none text-destructive peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					<span>Το προϊόν δεν είναι διαθέσιμο</span>
					<p class="text-xs text-muted-foreground">
						Το προϊόν θα εμφανίζεται στους πελάτες αλλά δε θα μπορούν να το προσθέσουν σε
						παραγγελίες τους.
					</p>
				</Label>
			</div>
		</div>
		<Button variant="default" class="text-base font-normal" on:click={handleSave}>Αποθήκευση</Button
		>
	{/if}
</div>

<!-- Confirmation dialog to prevent the user from accidentally deleting the product -->
<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Trigger />
	<Dialog.Content class="flex flex-col items-start">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2.5 border-b pb-2.5"
				><CircleAlert />Διαγραφή προϊόντος</Dialog.Title
			>
			<Dialog.Description class="text-left">
				Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτό το προϊόν; Αυτή η ενέργεια δεν μπορεί να
				αναιρεθεί.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="secondary" on:click={() => setIsDialogOpen(false)}>Ακύρωση</Button>
			<Button variant="destructive" on:click={handleDelete}>Διαγραφή</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
