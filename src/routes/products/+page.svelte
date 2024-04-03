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
	import { get } from 'svelte/store';
	import { toast } from 'svelte-sonner';
	import type { Product } from '$lib/types';

	export let data;
	const userRole: string = data.userRole;
	const products: Product[] = data.products;

	let isDialogOpen = false;
	const closeDialog = () => {
		isDialogOpen = false;
	};

	let isCartSheetOpen = false;
	const closeCartSheet = () => {
		isCartSheetOpen = false;
	};

	const submitOrder = async () => {
		const response = await fetch('/api/orders', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(get(cart))
		});

		if (response.ok) {
			cart.clear();
			closeCartSheet();
			toast.success('Η παραγγελία σας υποβλήθηκε επιτυχώς');
		} else {
			toast.error('Υπήρξε πρόβλημα κατά την υποβολή της παραγγελίας');
		}
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
			{#each products as product}
				<ProductEntryAdmin {product} />
			{/each}
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
			{#each products as product}
				<ProductEntryCustomer {product} />
			{/each}
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
					<CartEntry product={item} />
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
