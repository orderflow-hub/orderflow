<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import CustomerEntry from '$lib/shared/CustomerEntry.svelte';
	import AddNewCustomer from './AddNewCustomer.svelte';
	import { Search } from 'lucide-svelte';
	import type { Customer } from '$lib/types';
	import type { PageData } from './$types';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import customersStore from '../../stores/customersStore';

	export let data: PageData;

	let searchQuery = writable('');
	let intersectionRef: HTMLElement | null = null;

	onMount(() => {
		customersStore.loadInitialCustomers();
	});

	$: if (intersectionRef) {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					customersStore.loadMoreCustomers();
				}
			},
			{ threshold: 1 }
		);
		observer.observe(intersectionRef);
	}

	$: $searchQuery, customersStore.searchCustomers($searchQuery.trim());
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
