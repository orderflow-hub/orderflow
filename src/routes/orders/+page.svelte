<script lang="ts">
	import { Search } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import OrderEntry from '$lib/shared/OrderEntry.svelte';
	import SearchBar from '$lib/shared/SearchBar.svelte';
	import type { Order } from '$lib/types';
	import { onMount } from 'svelte';
	import InfiniteScroll from '$lib/shared/InfiniteScroll.svelte';
	import { toast } from 'svelte-sonner';
	import { writable, derived } from 'svelte/store';
	import { Moon } from 'svelte-loading-spinners';

	// TODO
	/* Implement throttling/debouncing for search input to reduce the number of API calls made while typing. This can be done in Svelte using a timeout in the reactive statement $:. */
	/* Implement a loading spinner while fetching data from the API, especially after a new search query is entered and while waiting for data when scrolling */

	export let data;
	const userRole: string = data.userRole;

	let searchQuery = writable('');
	let orders: Order[] = [];
	let isLoading = writable(false);
	let hasMore = true;
	let limit = 6;
	let offset = 0;

	let debounceTimer: number | NodeJS.Timeout;
	const debounceDelay = 500; // milliseconds

	function debounce(func: () => void, delay: number) {
		return (...args: any) => {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => func(...args), delay) as unknown as number;
		};
	}

	const loadOrders = async (query = '', reset = false) => {
		if (reset) {
			orders = [];
			offset = 0;
			hasMore = true;
		}
		isLoading.set(true);
		const response = await fetch(
			`/api/orders?limit=${limit}&offset=${offset}&search=${encodeURIComponent(query)}`,
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

	const debouncedLoadOrders = debounce(loadOrders, debounceDelay);

	// Reactively load orders when search query changes
	$: $searchQuery, debouncedLoadOrders($searchQuery, true);

	// let orders: Order[] = [];
	// let limit = 5;
	// let offset = 0;
	// let hasMore = true;
	// let searchQuery = writable('');

	// async function loadOrders(reset = false) {
	// 	if (reset) {
	// 		orders = [];
	// 		offset = 0;
	// 	}
	// 	const query = $searchQuery.trim();
	// 	const response = await fetch(
	// 		`/api/orders?limit=${limit}&offset=${offset}&search=${encodeURIComponent(query)}`,
	// 		{
	// 			method: 'GET',
	// 			headers: { 'Content-Type': 'application/json' }
	// 		}
	// 	);
	// 	const newOrders = await response.json();
	// 	if (newOrders.length > 0) {
	// 		hasMore = true;
	// 		offset += newOrders.length;
	// 	} else {
	// 		hasMore = false;
	// 	}
	// 	orders = [...orders, ...newOrders];
	// 	console.log('load more');
	// }

	// $: $searchQuery, loadOrders(true);
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
		<!-- {#if isLoading}
			<Moon size="60" color="#16a34a" unit="px" duration="1s" />
		{:else if hasMore}
			<InfiniteScroll {hasMore} on:loadMore={() => loadOrders()} />
		{/if} -->
	</div>
</div>
