<script lang="ts">
	import { Search } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import OrderEntry from '$lib/shared/OrderEntry.svelte';
	import SearchBar from '$lib/shared/SearchBar.svelte';
	import type { Order } from '$lib/types';

	export let data;
	const userRole: string = data.userRole;
	const orders: Order[] = data.orders;

	const now = new Date();
	const dateStringInGreek = now.toLocaleDateString('el-GR', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});

	const timeString = now.toLocaleTimeString('el-GR', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});

	const formattedDateTime = `${dateStringInGreek} • ${timeString}`;

	let object1 = {
		entry_title: 'Ταβέρνα - Τα 12 προβατάκια',
		timestamp: formattedDateTime,
		status: 'complete'
	};

	let object2 = {
		entry_title: 'Εστιατόριο - Τρώγοντας έρχεται η όρεξη',
		timestamp: formattedDateTime,
		status: 'pending'
	};
</script>

<div class="sticky top-0 flex items-center bg-white p-2.5">
	<div class="relative flex flex-grow items-center">
		<Input class="pl-10 text-base" placeholder="Αναζήτηση" type="search" />
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
	</div>
</div>
