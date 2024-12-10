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
	import { get } from 'svelte/store';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import { cart, itemCount } from '../../stores/cartStore';
	import productsStore from '../../stores/productsStore';
	import ordersStore from '../../stores/ordersStore';
	import * as Select from '$lib/components/ui/select';
	import type { Selected } from 'bits-ui';
	import type { Product } from '$lib/types';
	import { debounce } from '$lib/debounce';
	import { goto } from '$app/navigation';

	export let data: PageData;

	const userRole: string = data.userRole;

	let searchQuery = writable('');
	let intersectionRef: HTMLElement | null = null;
	let limit = 10;
	let category = 'all';

	// Function to fetch products
	const fetchProducts = async (reset = false) => {
		productsStore.setLoading(true);
		const query = $searchQuery.trim();
		const offset = reset ? 0 : $productsStore.length;

		const response = await fetch(
			`/api/products?limit=${limit}&offset=${offset}&search=${query}&category=${category}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);

		const newProducts: Product[] = await response.json();
		productsStore.setProducts(newProducts, reset);
		productsStore.setLoading(false);
		productsStore.setHasMore(newProducts.length === limit);
	};

	const debouncedFetchProducts = debounce((reset: boolean) => fetchProducts(reset), 500);

	$: if ($searchQuery) {
		debouncedFetchProducts(true);
	}

	$: if (intersectionRef) {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					fetchProducts();
				}
			},
			{ threshold: 0.5 }
		);
		observer.observe(intersectionRef);
	}

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
			// Retrieve the new order from the json response and add it to the order store
			const json = await response.json();
			ordersStore.setOrders([json.newOrder], false);

			cart.clear();
			closeCartSheet();
			toast.success('Η παραγγελία σας υποβλήθηκε επιτυχώς');
			goto('/orders');
		} else {
			toast.error('Υπήρξε πρόβλημα κατά την υποβολή της παραγγελίας');
		}
	};

	function handleSelectedChange(s: Selected<string> | undefined) {
		if (s && s.value !== previousSelection.value) {
			previousSelection = s; // Keep track of previous value to avoid sending reqeusts for the same category
			category = s.value;
			fetchProducts(true);
		}
	}

	let defaultSelection = { value: 'all', label: 'Όλα' };
	let previousSelection = defaultSelection as Selected<string>;
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
		<AddNewProduct {data} />
	</div>
	<div class="p-2.5 pt-0">
		<div class="w-full divide-y overflow-hidden rounded-lg border">
			{#each $productsStore as product}
				<ProductEntryAdmin {product} />
			{/each}
			<!-- Intersection Observer Target -->
			<div bind:this={intersectionRef}></div>
		</div>
		<!-- {#if $loading}
			<div class="flex justify-center p-2.5">
				<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
			</div>
		{/if} -->
	</div>
{:else if userRole === 'customer'}
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
		<Select.Root bind:selected={defaultSelection} onSelectedChange={(s) => handleSelectedChange(s)}>
			<Select.Input />
			<Select.Trigger class="w-1/3">
				<Select.Value />
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="all" label="Όλα" />
				<Select.Item value="fruits" label="Φρούτα" />
				<Select.Item value="vegetables" label="Κηπευτικά" />
				<Select.Item value="bundles" label="Δεματικά" />
			</Select.Content>
		</Select.Root>
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
			<!-- Intersection Observer Target -->
			<div bind:this={intersectionRef}></div>
		</div>
		<!-- {#if $loading}
			<div class="flex justify-center p-2.5">
				<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
			</div>
		{/if} -->
	</div>
	{#if $itemCount > 0}
		<div class="fixed bottom-12 left-0 right-0 flex justify-center p-2.5">
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
			<div class="divide-y overflow-auto rounded-lg">
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
