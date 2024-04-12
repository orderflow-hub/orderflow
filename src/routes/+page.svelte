<script>
	import OrderEntry from '$lib/shared/OrderEntry.svelte';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let userRole = 'admin';

	onMount(() => {
		if (userRole === 'customer') {
			goto('/orders');
		}
	});

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

<div class="p-2.5">
	<Card.Root class="overflow-hidden">
		<Card.Header class="border-b p-0">
			<Card.Title class="flex h-10 items-center justify-center bg-secondary font-normal">
				Ιστορικό Πωλήσεων
			</Card.Title>
		</Card.Header>
		<Card.Content class="divide-y p-0">
			<OrderEntry object={object1} />
			<OrderEntry object={object2} />
			<OrderEntry object={object1} />
			<OrderEntry object={object2} />
			<OrderEntry object={object2} />
		</Card.Content>
		<Card.Footer class="border-t p-0">
			<Button class="w-full rounded-none text-base">Προβολή όλων</Button>
		</Card.Footer>
	</Card.Root>

	<Card.Root class="mt-2.5 overflow-hidden">
		<Card.Header class="p-0">
			<Card.Title class="flex h-10 items-center justify-center border-b bg-secondary font-normal">
				Προιόντα
			</Card.Title>
		</Card.Header>
		<Card.Content class="p-0">
			<div class="flex justify-between p-2.5 text-zinc-700">
				<span>Ενεργά προιόντα</span>
				<span>105</span>
			</div>
			<div class="flex justify-between p-2.5 text-destructive">
				<span>Ανενεργά προιόντα</span>
				<span>72</span>
			</div>
			<Separator class="h-[0.8px] bg-neutral-200" />
			<div class="flex justify-between p-2.5 text-zinc-700">
				<span>Σύνολο</span>
				<span>177</span>
			</div>
		</Card.Content>
	</Card.Root>
</div>
