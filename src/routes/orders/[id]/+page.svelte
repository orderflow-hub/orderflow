<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { ArrowLeft, Trash, CircleAlert } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import OrderCartEntry from '$lib/shared/OrderCartEntry.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	// Get order data from the server to populate the fields
	export let data;
	let { order, userRole } = data;

	if (order === undefined) {
		throw new Error('Order not found');
	}

	// Handle the confirmation dialog for deleting the order
	let isDialogOpen = false;
	function setIsDialogOpen(isOpen: boolean) {
		isDialogOpen = isOpen;
	}

	// Delete the order from the database and show a toast notification. Redirect to '/orders' page if successful
	async function handleDelete() {
		const response = await fetch(`/api/orders/${order?.order_id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			toast.success('Η παραγγελία διαγράφηκε επιτυχώς');
			isDialogOpen = false;
			goto('/orders'); // Redirect to '/orders' page
		} else {
			toast.error('Υπήρξε πρόβλημα κατά τη διαγραφή της παραγγελίας');
		}
	}

	const orderDate = new Date(order.timestamp);
	const dateStringInGreek = orderDate.toLocaleDateString('el-GR', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});

	const timeString = orderDate.toLocaleTimeString('el-GR', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});

	const formattedDateTime = `${dateStringInGreek} • ${timeString}`;
</script>

<div class="flex flex-col gap-2.5 p-2.5">
	{#if order}
		<div class="flex w-full items-center gap-3">
			<a href="/orders" class="p-1">
				<ArrowLeft />
			</a>
			<div class="flex shrink grow flex-col items-start">
				<h1 class="text-base font-normal text-zinc-700">Παραγγελία #{order.order_id}</h1>
				{#if userRole === 'customer'}
					<div class="text-xs font-normal text-slate-400">{formattedDateTime}</div>
				{/if}
			</div>
			{#if userRole === 'admin'}
				<Button variant="ghost" size="icon" on:click={() => setIsDialogOpen(true)}>
					<Trash class="h-5 w-5" />
				</Button>
			{/if}
		</div>
		{#if userRole === 'admin'}
			<Card.Root class="overflow-hidden">
				<Card.Header class="p-0">
					<Card.Title
						class="flex h-10 items-center justify-center border-b bg-secondary font-normal"
					>
						Λεπτομέρειες
					</Card.Title>
				</Card.Header>
				<Card.Content class="p-0">
					<div class="flex flex-col gap-4 px-4 py-3.5">
						<div class="flex flex-col gap-1.5">
							<div class="text-[17px] font-normal text-zinc-700">
								{order.company_name}
							</div>
							<div class="text-xs font-normal text-slate-400">{formattedDateTime}</div>
						</div>
						<div class="flex flex-col items-start justify-center gap-1.5">
							<div class="flex gap-1">
								<div class="text-sm font-semibold text-slate-400">Διεύθυνση:</div>
								<div class="text-sm font-semibold text-zinc-700">
									{`${order.street_address}, ${order.city} ${order.postal_code}`}
								</div>
							</div>
							<div class="flex items-center gap-1">
								<div class="text-sm font-semibold text-slate-400">Τηλέφωνο:</div>
								<div class="text-sm font-semibold text-zinc-700">{order.phone_number}</div>
							</div>
							<div class="flex items-center gap-1">
								<div class="text-sm font-semibold text-slate-400">Α.Φ.Μ.:</div>
								<div class="text-sm font-semibold text-zinc-700">{order.phone_number}</div>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		{/if}
		<Card.Root class="overflow-hidden">
			<Card.Header class="p-0">
				<Card.Title class="flex h-10 items-center justify-center border-b bg-secondary font-normal">
					Καλάθι
				</Card.Title>
			</Card.Header>
			<Card.Content class="divide-y p-0">
				{#each order.products as product}
					<OrderCartEntry {product} showImage={false} />
				{/each}
			</Card.Content>
		</Card.Root>
	{/if}
</div>

<!-- Confirmation dialog to prevent the user from accidentally deleting the order -->
<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Trigger />
	<Dialog.Content class="flex flex-col items-start">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2.5 border-b pb-2.5"
				><CircleAlert />Διαγραφή παραγγελίας</Dialog.Title
			>
			<Dialog.Description class="text-left">
				Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτή την παραγγελία; Αυτή η ενέργεια δεν μπορεί να
				αναιρεθεί.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="secondary" on:click={() => setIsDialogOpen(false)}>Ακύρωση</Button>
			<Button variant="destructive" on:click={handleDelete}>Διαγραφή</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
