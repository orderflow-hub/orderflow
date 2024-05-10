<script lang="ts">
	import ProductEntryAdmin from '$lib/shared/ProductEntryAdmin.svelte';
	import ProductEntryCustomer from '$lib/shared/ProductEntryCustomer.svelte';
	import CartEntry from '$lib/shared/CartEntry.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Search, ArrowRight } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import AddNewProduct from './AddNewProduct.svelte';
	import { cn } from '$lib/utils';
	import { cart, itemCount } from '../../stores/cartStore';
	import { get } from 'svelte/store';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import type { Product } from '$lib/types';
	import debounce from 'debounce';
	import productsStore from '../../stores/productsStore';

	export let data: PageData;

	const userRole: string = data.userRole;

	let products: Product[] = [];
	let searchQuery = writable('');
	let intersectionRef: HTMLElement | null = null;

	onMount(() => {
		productsStore.loadInitialProducts();
	});

	$: if (intersectionRef) {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					productsStore.loadMoreProducts();
				}
			},
			{ threshold: 1 }
		);
		observer.observe(intersectionRef);
	}

	$: $searchQuery, productsStore.searchProducts($searchQuery.trim());

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
			<Input
				class="pl-10 text-base"
				placeholder="Αναζήτηση"
				type="search"
				bind:value={$searchQuery}
			/>
			<div
				class="pointer-events-none absolute inset-y-0 left-2.5 flex w-10 items-center p-0 text-muted-foreground"
			>
				<Search size={18} />
			</div>
		</div>
		<AddNewProduct data={data.form} />
	</div>
	<div class="p-2.5 pt-0">
		<div class="w-full divide-y overflow-hidden rounded-lg border">
			{#each $productsStore as product}
				<ProductEntryAdmin {product} />
			{/each}
			{#if productsStore.loading}
				<!-- Loading Indicator -->
				<div>Loading...</div>
			{/if}
			{#if productsStore.hasMore}
				<!-- Intersection Observer Target -->
				<div bind:this={intersectionRef}></div>
			{/if}
		</div>
	</div>
{:else if userRole === 'customer'}
	<div class="sticky top-0 z-10 flex items-center bg-white p-2.5">
		<div class="relative flex flex-grow items-center">
			<Input
				class="pl-10 text-base"
				placeholder="Αναζήτηση"
				type="search"
				bind:value={searchQuery}
			/>
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
		<div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
			{#each $productsStore as product}
				<ProductEntryCustomer {product} />
			{/each}
			{#if productsStore.loading}
				<!-- Loading Indicator -->
				<div>Loading...</div>
			{/if}
			{#if productsStore.hasMore}
				<!-- Intersection Observer Target -->
				<div bind:this={intersectionRef}></div>
			{/if}
		</div>
	</div>
	{#if $itemCount > 0}
		<div class="sticky bottom-12 flex justify-center p-2.5">
			<Button
				class="relative w-full gap-2 px-2 text-base md:w-1/2 lg:w-1/3"
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
			<Sheet.Close autofocus />
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

<!-- <style>
	footer {
		height: 20px; /* Ensure it has size to be observed */
	}
	/* Add additional styles as needed */
</style> -->
