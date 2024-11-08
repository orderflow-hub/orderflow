<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { ArrowLeft, Trash, CircleAlert } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import OrderCartEntry from '$lib/shared/OrderCartEntry.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { returnToHome } from '../../../stores/orderNavigationStore';
	import pdfMake from 'pdfmake/build/pdfmake';
	import type { TDocumentDefinitions, Content, StyleDictionary } from 'pdfmake/interfaces';
	import ordersStore from '../../../stores/ordersStore';
	import * as Select from '$lib/components/ui/select';
	import type { Selected } from 'bits-ui';
	import { Toaster } from '$lib/components/ui/sonner';

	// Get order data from the server to populate the fields
	export let data;
	let { order, userRole } = data;

	if (order === undefined) {
		toast.error('Η παραγγελία δεν βρέθηκε');
		throw new Error('Order not found');
	}

	const statuses = [
		{ value: 'pending', label: 'Σε εκκρεμότητα' },
		{ value: 'complete', label: 'Ολοκληρωμένη' }
	];

	let currentStatus = {
		value: order.status,
		label: statuses.find((status) => status.value == order.status)?.label
	};

	let goHome: boolean;
	returnToHome.subscribe((value) => {
		goHome = value;
	});

	// Handle the confirmation dialog for deleting the order
	let isDialogOpen = false;
	function setIsDialogOpen(isOpen: boolean) {
		isDialogOpen = isOpen;
	}

	// Delete the order from the database and show a toast notification. Redirect to '/orders' page if successful
	async function handleDelete() {
		if (!order) return;

		const response = await fetch(`/api/orders/${order?.order_id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			toast.success('Η παραγγελία διαγράφηκε επιτυχώς');
			isDialogOpen = false;

			// Filters deleted product from the store.
			let filteredOrders = $ordersStore.filter((o) => o.order_id !== order.order_id);
			ordersStore.setOrders(filteredOrders, true);

			// Redirect to '/orders' page
			goto('/orders');
		} else {
			toast.error('Υπήρξε πρόβλημα κατά τη διαγραφή της παραγγελίας');
		}
	}

	const formattedDateTime = new Date(order.timestamp)
		.toLocaleString('el-GR', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		})
		.replace(',', ' •');

	const saleUnitLabels: { [key: string]: string } = {
		kg: 'Κιλά',
		piece: 'Τεμάχια',
		crate: 'Τελάρα',
		bunch: 'Ματσάκια',
		cup: 'Κουπάκια'
	};

	pdfMake.fonts = {
		Roboto: {
			normal:
				'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
			bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
			italics:
				'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
			bolditalics:
				'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
		}
	};

	const docDefinition: TDocumentDefinitions = {
		pageSize: { width: 227, height: 'auto' },
		pageMargins: [10, 10, 10, 10],
		content: [
			{ text: 'Στοιχεία Επιχείρησης', style: 'sectionHeader' } as Content,
			{ text: `Όνομα Επιχείρησης: ${order.company_name}`, style: 'businessLabel' } as Content,
			{ text: `Ημερομηνία: ${formattedDateTime}`, style: 'businessLabel' } as Content,
			{ text: `ΑΦΜ: ${order.afm}`, style: 'businessLabel' } as Content,
			{ text: `Τηλέφωνο: ${order.phone_number}`, style: 'businessLabel' } as Content,
			{ text: '', margin: [0, 0, 0, 10] } as Content,
			{ text: 'Προϊόντα', style: 'sectionHeader' } as Content,
			{
				table: {
					widths: ['*', 'auto', 'auto', 'auto'],
					body: [
						[
							{ text: 'Προϊόντα', style: 'tableHeader' },
							{ text: 'Ποσότητα', style: 'tableHeader' },
							{ text: 'Μονάδα', style: 'tableHeader' },
							{ text: 'Κατάσταση', style: 'tableHeader' }
						],
						...order.products.map((product) => [
							{ text: product.product_name } as Content,
							{ text: product.qty } as Content,
							{ text: saleUnitLabels[product.sale_unit] } as Content,
							{ text: '', alignment: 'center' } as Content
						])
					]
				},
				layout: {
					fillColor: function (rowIndex: number, node: any, columnIndex: any) {
						return rowIndex % 2 === 0 ? '#F5F5F5' : null;
					},
					hLineColor: function (i: number, node: { table: { body: any[] } }) {
						return i === 0 || i === node.table.body.length ? 'black' : 'gray';
					},
					vLineColor: function (i: number, node: { table: { widths: any[] } }) {
						return i === 0 || i === node.table.widths.length ? 'black' : 'gray';
					},
					paddingLeft: function (i: number) {
						return i === 0 ? 5 : 5;
					},
					paddingRight: function (i: number) {
						return i === 0 ? 5 : 5;
					},
					paddingTop: function (i: any) {
						return 2;
					},
					paddingBottom: function (i: any) {
						return 2;
					}
				}
			} as Content
		],
		styles: {
			sectionHeader: {
				fontSize: 10,
				bold: true,
				margin: [0, 0, 0, 10],
				alignment: 'center'
			},
			businessLabel: {
				fontSize: 9,
				margin: [0, 2, 0, 2]
			},
			tableHeader: {
				fontSize: 7,
				bold: true,
				alignment: 'center',
				fillColor: '#CCCCCC'
			}
		} as StyleDictionary,
		defaultStyle: {
			fontSize: 7
		}
	};

	const handleDirectPrint = async () => {
		try {
			const response = await fetch('/api/print', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ order })
			});

			if (response.ok) {
				toast.success('Το αίτημα εκτύπωσης στάλθηκε');
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('Υπήρξε πρόβλημα κατά την εκτύπωση της παραγγελίας');
			indirectPrint(); // Open manual print dialog if no printer IP
		}
	};

	const indirectPrint = () => {
		pdfMake.createPdf(docDefinition).open();
	};

	// Update the order status.
	async function handleStatusChange(s: Selected<string> | undefined) {
		if (s && order) {
			// Updates current status variable.
			currentStatus = {
				value: s.value as 'pending' | 'complete',
				label: s.label
			};

			// Request to change status in the database
			try {
				const response = await fetch(`/api/orders/${order.order_id}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ status: currentStatus.value })
				});

				if (response.ok) {
					// Finds order in the Store and updates its status.
					let orderToUpdate = $ordersStore.find((o) => o.order_id == order.order_id);
					if (orderToUpdate) orderToUpdate.status = currentStatus.value;

					toast.success('Κατάσταση παραγγελίας ενημερώθηκε επιτυχώς');
				} else {
					const error = await response.json();
					toast.error(`Σφάλμα: ${error.error || 'Δεν ήταν δυνατή η ενημέρωση της κατάστασης'}`);
				}
			} catch (error) {
				console.error(error);
				toast.error('Σφάλμα κατά την επικοινωνία με τον διακομιστή');
			}
		}
	}
</script>

<div class="flex flex-col gap-2.5 p-2.5">
	{#if order}
		<div class="flex w-full items-center gap-3">
			<a href={goHome ? '/' : '/orders'} class="p-1">
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
		{#if userRole === 'admin'}
			<p>Κατάσταση παραγγελίας *</p>
			<Select.Root bind:selected={currentStatus} onSelectedChange={(s) => handleStatusChange(s)}>
				<Select.Input />
				<Select.Trigger class="mb-2 w-full p-1">
					<Select.Value />
				</Select.Trigger>
				<Select.Content sameWidth={true} align="end" alignOffset={4} class="w-[110px] sm:w-[120px]">
					{#each statuses as status}
						<Select.Item value={status.value} label={status.label} />
					{/each}
				</Select.Content>
			</Select.Root>
		{/if}
		<Button on:click={handleDirectPrint}>Εκτύπωση</Button>
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
