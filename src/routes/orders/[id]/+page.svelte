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
	import pdfFonts from 'pdfmake/build/vfs_fonts';

	// Get order data from the server to populate the fields
	export let data;
	let { order, userRole } = data;

	if (order === undefined) {
		throw new Error('Order not found');
	}

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

	pdfMake.vfs = pdfFonts.pdfMake.vfs;

	const handlePrint = () => {
		const docDefinition = {
			pageSize: { width: 230, height: 'auto' },
			content: [
				{ text: 'Στοιχεία Επιχείρησης', style: 'sectionHeader' },
				{ text: `Όνομα Επιχείρησης: ${order.company_name}`, style: 'businessLabel' },
				{ text: `Ημερομηνία: ${formattedDateTime}`, style: 'businessLabel' },
				{ text: `ΑΦΜ: ${order.afm}`, style: 'businessLabel' },
				{ text: `Τηλέφωνο: ${order.phone_number}`, style: 'businessLabel' },
				{ text: '', margin: [0, 0, 0, 10] },
				{ text: 'Προϊόντα', style: 'sectionHeader' },
				{
					table: {
						widths: ['*', 'auto', 'auto'],
						body: [
							[
								{ text: 'Προϊόντα', style: 'tableHeader' },
								{ text: 'Ποσότητα', style: 'tableHeader' },
								{ text: 'Μονάδα', style: 'tableHeader' }
							],
							...order.products.map((product) => [
								product.product_name,
								product.qty,
								product.sale_unit
							])
						]
					},
					layout: {
						fillColor: function (rowIndex: number, node: any, columnIndex: any) {
							return rowIndex % 2 === 0 ? '#F5F5F5' : null;
						},
						hLineColor: function (i: number, node: { table: { body: string | any[] } }) {
							return i === 0 || i === node.table.body.length ? 'black' : 'gray';
						},
						vLineColor: function (i: number, node: { table: { widths: string | any[] } }) {
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
				}
			],
			styles: {
				sectionHeader: {
					fontSize: 12,
					bold: true,
					margin: [0, 10, 0, 10],
					alignment: 'center'
				},
				businessLabel: {
					fontSize: 10,
					margin: [0, 2, 0, 2]
				},
				tableHeader: {
					fontSize: 10,
					bold: true,
					alignment: 'center',
					fillColor: '#CCCCCC'
				}
			},
			defaultStyle: {
				fontSize: 8
			}
		};

		pdfMake.createPdf(docDefinition).open();
	};
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
		<Button on:click={handlePrint}>Εκτύπωση</Button>
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
