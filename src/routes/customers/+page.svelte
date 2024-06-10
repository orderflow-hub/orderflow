<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import CustomerEntry from '$lib/shared/CustomerEntry.svelte';
	import AddNewCustomer from './AddNewCustomer.svelte';
	import { Search } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import customersStore from '../../stores/customersStore';

	export let data: PageData;

	let searchQuery = writable('');
	let intersectionRef: HTMLElement | null = null;
	let limit = 10;

	const fetchCustomers = async (reset = false) => {
		customersStore.setLoading(true);
		const query = $searchQuery.trim();
		const response = await fetch(
			`/api/customers?limit=${limit}&offset=${reset ? 0 : $customersStore.length}&search=${query}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);
		const newCustomers = await response.json();
		customersStore.setCustomers(newCustomers, reset);
		customersStore.setLoading(false);
		customersStore.setHasMore(newCustomers.length === limit);
	};

	$: if ($searchQuery) {
		fetchCustomers(true);
	}

	$: if (intersectionRef) {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					fetchCustomers(false);
				}
			},
			{ threshold: 0.5 }
		);
		observer.observe(intersectionRef);
	}
</script>

<div class="sticky top-0 flex items-center gap-2.5 bg-white p-2.5">
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
	<AddNewCustomer data={data.form} />
</div>
<div class="p-2.5 pt-0">
	<div class="w-full divide-y overflow-hidden rounded-lg border">
		{#each $customersStore as customer}
			<CustomerEntry {customer} />
		{/each}
		<!-- Intersection Observer Target -->
		<div bind:this={intersectionRef}></div>
	</div>
</div>
