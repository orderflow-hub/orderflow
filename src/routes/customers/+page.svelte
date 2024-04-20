<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import CustomerEntry from '$lib/shared/CustomerEntry.svelte';
	import AddNewCustomer from './AddNewCustomer.svelte';
	import { Search } from 'lucide-svelte';
	import type { Customer } from '$lib/types';
	import type { PageData } from './$types';

	export let data: PageData;
	const customers: Customer[] = data.customers;
</script>

<div class="sticky top-0 flex items-center gap-2.5 bg-white p-2.5">
	<div class="relative flex flex-grow items-center">
		<Input class="pl-10 text-base" placeholder="Αναζήτηση" type="search" />
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
	</div>
</div>
