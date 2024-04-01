<script>
	import { Search } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import OrderEntry from '$lib/shared/OrderEntry.svelte';
	import SearchBar from '$lib/shared/SearchBar.svelte';

	let userRole = 'customer';

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

	// If the user is a customer, just load different data
	// The interface stays the same
	if (userRole === 'customer') {
		object1.entry_title = '#123';
		object2.entry_title = '#456';
	}
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
		<OrderEntry object={object1} />
		<OrderEntry object={object2} />
		<OrderEntry object={object1} />
		<OrderEntry object={object2} />
		<OrderEntry object={object2} />
		<OrderEntry object={object2} />
		<OrderEntry object={object2} />
		<OrderEntry object={object2} />
	</div>
</div>
