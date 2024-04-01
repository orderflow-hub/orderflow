<script lang="ts">
	import ProductEntryAdmin from '$lib/shared/ProductEntryAdmin.svelte';
	import ProductEntryCustomer from '$lib/shared/ProductEntryCustomer.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Plus } from 'lucide-svelte';
	import { Search } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import AddNewProduct from '$lib/components/AddNewProduct.svelte';

	export let data;
	let { products, userRole } = data;

	let isDialogOpen = false;
	const closeDialog = () => {
		isDialogOpen = false;
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
			{#each products as product}
				<ProductEntryAdmin {product} />
			{/each}
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
			{#each products as product}
				<ProductEntryCustomer {product} />
			{/each}
		</div>
	</div>
{/if}
