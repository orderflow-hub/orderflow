<script lang="ts">
	import { Search } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import OrderEntry from '$lib/shared/OrderEntry.svelte';
	import SearchBar from '$lib/shared/SearchBar.svelte';
	import type { Order } from '$lib/types';
	import { onMount } from 'svelte';
	import InfiniteScroll from '$lib/shared/InfiniteScroll.svelte';
	import { toast } from 'svelte-sonner';
	import { writable } from 'svelte/store';

	// TODO
	/* Implement throttling/debouncing for search input to reduce the number of API calls made while typing. This can be done in Svelte using a timeout in the reactive statement $:. */
	/* Implement a loading spinner while fetching data from the API, especially after a new search query is entered and while waiting for data when scrolling */

	export let data;
	const userRole: string = data.userRole;

	let orders: Order[] = [];
	let limit = 5;
	let offset = 0;
	let hasMore = true;
	let searchQuery = writable('');

	async function loadOrders(reset = false) {
		if (reset) {
			orders = [];
			offset = 0;
		}
		const query = $searchQuery.trim();
		const response = await fetch(
			`/api/orders?limit=${limit}&offset=${offset}&search=${encodeURIComponent(query)}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);
		const newOrders = await response.json();
		if (newOrders.length > 0) {
			hasMore = true;
			offset += newOrders.length;
		} else {
			hasMore = false;
		}
		orders = [...orders, ...newOrders];
	}

	$: $searchQuery, loadOrders(true);

	// // Previous implmentation without search functionality
	// let orders: Order[] = data.orders;
	// async function loadMore() {
	// 	const response = await fetch(`/api/orders?limit=${limit}&offset=${orders.length}`, {
	// 		method: 'GET',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		}
	// 	});
	// 	const newOrders = await response.json();
	// 	if (newOrders.length > 0) {
	// 		orders = [...orders, ...newOrders];
	// 		offset += limit;
	// 	} else {
	// 		hasMore = false;
	// 	}
	// }
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
