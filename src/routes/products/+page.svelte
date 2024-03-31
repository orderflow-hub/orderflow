<script lang="ts">
	import ProductEntryAdmin from '$lib/shared/ProductEntryAdmin.svelte';
	import ProductEntryCustomer from '$lib/shared/ProductEntryCustomer.svelte';
	import CartEntry from '$lib/shared/CartEntry.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Plus, Search, ArrowRight } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Sheet from '$lib/components/ui/sheet';
	import AddNewProduct from '$lib/components/AddNewProduct.svelte';
	import { cn } from '$lib/utils';
	import { cart, itemCount } from '../../stores/cartStore';

	let isDialogOpen = false;
	const closeDialog = () => {
		isDialogOpen = false;
	};

	let isCartSheetOpen = false;
	const closeCartSheet = () => {
		isCartSheetOpen = false;
	};

	const submitOrder = () => {
		// TODO: Implement order submission
		// Make async call to API endpoint to submit order
		// On success, clear the cart, close the cart sheet and show a success toast message
		// On failure, show an error toast message
		cart.clear();
		closeCartSheet();
	};

	// TODO: Read role from user context
	let userRole = 'customer';

	// TODO: Fetch products from API
	let object1 = {
		id: 1,
		image: 'https://www.alrizq.sa/wp-content/uploads/2022/10/SPINACH-BUNCH.jpg',
		product_name: 'ΣΠΑΝΑΚΙ',
		product_code: 'ΕΙΔΗ-000000023',
		isAvailable: true,
		sale_unit: 'piece',
		qty: 1
	};

	let object2 = {
		id: 2,
		image: 'https://www.doorsteporganics.com.au/image/optimised/large/Tomatoes-Round-1kg.jpg',
		product_name: 'ΝΤΟΜΑΤΕΣ ΚΡΗΤΗΣ',
		product_code: 'ΕΙΔΗ-000000024',
		isAvailable: true,
		sale_unit: 'kg',
		qty: 1
	};
</script>

{#if userRole === 'admin'}
	<div class="sticky top-0 z-10 flex items-center gap-2.5 bg-white p-2.5">
		<div class="relative flex flex-grow items-center">
			<Input class="pl-10 text-base" placeholder="Αναζήτηση" type="search" />
			<div
				class="pointer-events-none absolute inset-y-0 left-2.5 flex w-10 items-center p-0 text-muted-foreground"
			>
				<Search size={18} />
			</div>
		</div>
		<Dialog.Root bind:open={isDialogOpen}>
			<Dialog.Trigger class="text-base font-normal">
				<Button class="w-10 grow-0 border bg-transparent p-0 text-muted-foreground">
					<Plus />
				</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header class="mb-2.5">
					<Dialog.Title>Προσθήκη νέου προϊόντος</Dialog.Title>
				</Dialog.Header>
				<AddNewProduct />
				<Dialog.Footer>
					<Button variant="secondary" on:click={closeDialog}>Ακύρωση</Button>
					<Button type="submit">Προσθήκη</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</div>
	<div class="p-2.5 pt-0">
		<div class="w-full divide-y overflow-hidden rounded-lg border">
			<ProductEntryAdmin object={object1} />
			<ProductEntryAdmin object={object1} />
			<ProductEntryAdmin object={object1} />
			<ProductEntryAdmin object={object1} />
			<ProductEntryAdmin object={object2} />
			<ProductEntryAdmin object={object2} />
			<ProductEntryAdmin object={object1} />
			<ProductEntryAdmin object={object2} />
			<ProductEntryAdmin object={object1} />
			<ProductEntryAdmin object={object2} />
		</div>
	</div>
{:else if userRole === 'customer'}
	<div class="sticky top-0 z-10 flex items-center bg-white p-2.5">
		<div class="relative flex flex-grow items-center">
			<Input class="pl-10 text-base" placeholder="Αναζήτηση" type="search" />
			<div
				class="pointer-events-none absolute inset-y-0 left-2.5 flex w-10 items-center p-0 text-muted-foreground"
			>
				<Search size={18} />
			</div>
		</div>
	</div>
	<div
		class={cn('px-2.5', {
			'pb-2.5': $itemCount === 0
		})}
	>
		<div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
			<ProductEntryCustomer object={object1} />
			<ProductEntryCustomer object={object1} />
			<ProductEntryCustomer object={object1} />
			<ProductEntryCustomer object={object2} />
			<ProductEntryCustomer object={object2} />
		</div>
	</div>
	{#if $itemCount > 0}
		<div class="sticky bottom-12 flex p-2.5">
			<Button
				class="relative w-full gap-2 px-2 text-base"
				variant="default"
				on:click={() => {
					isCartSheetOpen = true;
				}}>Καλάθι ({$itemCount})<ArrowRight class="absolute right-2" /></Button
			>
		</div>
	{/if}

	<Sheet.Root bind:open={isCartSheetOpen}>
		<Sheet.Trigger />
		<Sheet.Content side="bottom" class="flex max-h-full flex-col gap-4 px-2 md:px-6">
			<Sheet.Header>
				<Sheet.Title>Καλάθι</Sheet.Title>
			</Sheet.Header>
			<div class="w-full divide-y overflow-auto rounded-lg border">
				{#each $cart as item}
					<CartEntry {item} />
				{/each}
			</div>
			<Sheet.Footer class="flex flex-col items-stretch gap-2.5">
				<Button variant="default" on:click={submitOrder}>Αποστολή Παραγγελίας</Button>
				<Button
					variant="destructive"
					on:click={() => {
						cart.clear();
						closeCartSheet();
					}}>Άδειασμα Καλαθιού</Button
				>
			</Sheet.Footer>
		</Sheet.Content>
	</Sheet.Root>
{/if}
