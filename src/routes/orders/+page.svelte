<script lang="ts">
	import { Search } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import OrderEntry from '$lib/shared/OrderEntry.svelte';
	import type { Order } from '$lib/types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import ordersStore from '../../stores/ordersStore';

	export let data;
	const userRole: string = data.userRole;

	let orders: Order[] = [];
	let searchQuery = writable('');
	let intersectionRef: HTMLElement | null = null;

	onMount(() => {
		ordersStore.loadInitialOrders();
	});

	$: if (intersectionRef) {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					ordersStore.loadMoreOrders();
				}
			},
			{ threshold: 1 }
		);
		observer.observe(intersectionRef);
	}

	$: $searchQuery, ordersStore.searchOrders($searchQuery.trim());
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
