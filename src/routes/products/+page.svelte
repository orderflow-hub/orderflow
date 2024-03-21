<script>
	import ProductEntryAdmin from '$lib/shared/ProductEntryAdmin.svelte';
	import ProductEntryCustomer from '$lib/shared/ProductEntryCustomer.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Plus } from 'lucide-svelte';
	import { Search } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import AddNewProduct from '$lib/components/AddNewProduct.svelte';

	let isDialogOpen = false;
	const closeDialog = () => {
		isDialogOpen = false;
	};

	let userRole = 'customer';

	let object1 = {
		image: 'https://www.alrizq.sa/wp-content/uploads/2022/10/SPINACH-BUNCH.jpg',
		product_name: 'ΣΠΑΝΑΚΙ',
		product_code: 'ΕΙΔΗ-000000023',
		isAvailable: true,
		sale_unit: 'piece'
	};

	let object2 = {
		image: 'https://www.doorsteporganics.com.au/image/optimised/large/Tomatoes-Round-1kg.jpg',
		product_name: 'ΝΤΟΜΑΤΕΣ ΚΡΗΤΗΣ',
		product_code: 'ΕΙΔΗ-000000024',
		isAvailable: false,
		sale_unit: 'kg'
	};
</script>

{#if userRole === 'admin'}
	<div class="sticky top-0 z-10 flex items-center gap-2.5 bg-white p-2.5">
		<div class="relative flex flex-grow items-center">
			<Input class="pl-10 text-base" placeholder="Αναζήτηση" type="search" />
			<div
				class="pointer-events-none absolute inset-y-0 left-2.5 flex w-10 items-center p-0 text-muted-foreground"
			>
				<Search size={18} />
			</div>
		</div>
		<Dialog.Root bind:open={isDialogOpen}>
			<Dialog.Trigger class="text-base font-normal">
				<Button class="w-10 grow-0 border bg-transparent p-0 text-muted-foreground">
					<Plus />
				</Button>
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header class="mb-2.5">
					<Dialog.Title>Προσθήκη νέου προϊόντος</Dialog.Title>
				</Dialog.Header>
				<AddNewProduct />
				<Dialog.Footer>
					<Button variant="secondary" on:click={closeDialog}>Ακύρωση</Button>
					<Button type="submit">Προσθήκη</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</div>
	<div class="p-2.5 pt-0">
		<div class="w-full divide-y overflow-hidden rounded-lg border">
			<ProductEntryAdmin object={object1} />
			<ProductEntryAdmin object={object1} />
			<ProductEntryAdmin object={object1} />
			<ProductEntryAdmin object={object1} />
			<ProductEntryAdmin object={object2} />
			<ProductEntryAdmin object={object2} />
			<ProductEntryAdmin object={object1} />
			<ProductEntryAdmin object={object2} />
			<ProductEntryAdmin object={object1} />
			<ProductEntryAdmin object={object2} />
		</div>
	</div>
{:else if userRole === 'customer'}
	<div class="sticky top-0 z-10 flex items-center bg-white p-2.5">
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
		<div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
			<ProductEntryCustomer object={object1} />
			<ProductEntryCustomer object={object1} />
			<ProductEntryCustomer object={object1} />
			<ProductEntryCustomer object={object2} />
			<ProductEntryCustomer object={object2} />
		</div>
	</div>
{/if}
