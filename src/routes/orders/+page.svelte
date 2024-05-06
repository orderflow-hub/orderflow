<script lang="ts">
	import { Search } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import OrderEntry from '$lib/shared/OrderEntry.svelte';
	import type { Order } from '$lib/types';
	import { onMount } from 'svelte';
	import InfiniteScroll from '$lib/shared/InfiniteScroll.svelte';
	import { writable, derived } from 'svelte/store';
	import { Moon } from 'svelte-loading-spinners';
	import debounce from 'debounce';

	export let data;
	const userRole: string = data.userRole;

	let searchQuery = writable('');
	let orders: Order[] = [];
	let isLoading = writable(false);
	let hasMore = true;
	let limit = 6;
	let offset = 0;

	const loadOrders = async (query = '', reset = false) => {
		if (reset) {
			orders = [];
			offset = 0;
			hasMore = true;
		}
		isLoading.set(true);
		const response = await fetch(
			`http://localhost:5173/api/orders?limit=${limit}&offset=${offset}&search=${encodeURIComponent(query)}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);
		if (response.ok) {
			const newOrders = await response.json();
			if (newOrders.length > 0) {
				orders = reset ? newOrders : [...orders, ...newOrders];
				offset += newOrders.length;
			} else {
				hasMore = false;
			}
		} else {
			console.error('Failed to load orders');
			hasMore = false;
		}
		isLoading.set(false);
	};

	// Debounce the search query input to prevent excessive API calls
	const debouncedLoadOrders = debounce((query) => {
		loadOrders(query, true);
	}, 500);

	searchQuery.subscribe(($searchQuery) => {
		debouncedLoadOrders($searchQuery.trim());
	});
</script>

<div class="sticky top-0 flex items-center bg-white p-2.5">
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
</div>
<div class="p-2.5 pt-0">
	<div class="w-full divide-y overflow-hidden rounded-lg border">
		{#each orders as order}
			<OrderEntry {order} {userRole} />
		{/each}
		<InfiniteScroll {hasMore} on:loadMore={() => loadOrders()} />
	</div>
</div>
