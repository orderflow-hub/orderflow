<script lang="ts">
	import { Search } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import OrderEntry from '$lib/shared/OrderEntry.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import ordersStore from '../../stores/ordersStore';
	import { debounce } from '$lib/debounce';

	export let data;
	const userRole: string = data.userRole;

	let searchQuery = writable('');
	let intersectionRef: HTMLElement | null = null;
	let limit = 10;

	// Function to fetch orders
	const fetchOrders = async (reset = false) => {
		ordersStore.setLoading(true);
		const query = $searchQuery.trim();
		const response = await fetch(
			`/api/orders?limit=${limit}&offset=${reset ? 0 : $ordersStore.length}&search=${query}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);
		const newOrders = await response.json();
		ordersStore.setOrders(newOrders, reset);
		ordersStore.setLoading(false);
		ordersStore.setHasMore(newOrders.length === limit);
	};

	const debouncedFetchProducts = debounce((reset: boolean) => fetchOrders(reset), 500);

	$: if ($searchQuery) {
		debouncedFetchProducts(true);
	}

	$: if (intersectionRef) {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					fetchOrders();
				}
			},
			{ threshold: 0.5 }
		);
		observer.observe(intersectionRef);
	}
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
		{#each $ordersStore as order}
			<OrderEntry {order} {userRole} />
		{/each}
		<!-- Intersection Observer Target -->
		<div bind:this={intersectionRef}></div>
	</div>
</div>
