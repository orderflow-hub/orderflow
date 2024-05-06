<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import CustomerEntry from '$lib/shared/CustomerEntry.svelte';
	import AddNewCustomer from './AddNewCustomer.svelte';
	import { Search } from 'lucide-svelte';
	import type { Customer } from '$lib/types';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import InfiniteScroll from '$lib/shared/InfiniteScroll.svelte';
	import debounce from 'debounce';

	export let data: PageData;

	let customers: Customer[] = [];
	let searchQuery = writable('');
	let hasMore = true;
	let limit = 6;
	let offset = 0;

	async function loadCustomers(reset = false) {
		if (reset) {
			customers = [];
			offset = 0;
		}
		const query = $searchQuery.trim();
		const response = await fetch(
			`http://localhost:5173/api/customers?limit=${limit}&offset=${offset}&search=${encodeURIComponent(query)}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);
		if (response.ok) {
			const newCustomers = await response.json();
			if (newCustomers.length > 0) {
				customers = reset ? newCustomers : [...customers, ...newCustomers];
				offset += newCustomers.length;
			} else {
				hasMore = false;
			}
		} else {
			console.error('Failed to load customers');
			hasMore = false;
		}
	}

	// $: $searchQuery, loadCustomers(true);

	// Debounce the search query input to prevent excessive API calls
	const debouncedLoadCustomers = debounce((query) => {
		loadCustomers(query);
	}, 500);

	searchQuery.subscribe(($searchQuery) => {
		debouncedLoadCustomers($searchQuery.trim());
	});
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
		{#each customers as customer}
			<CustomerEntry {customer} />
		{/each}
		<InfiniteScroll {hasMore} on:loadMore={() => loadCustomers()} />
	</div>
</div>
