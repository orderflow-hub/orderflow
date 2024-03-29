<script>
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import CustomerEntry from '$lib/shared/CustomerEntry.svelte';
	import AddNewCustomer from '$lib/components/AddNewCustomer.svelte';
	import { Plus } from 'lucide-svelte';
	import { Search } from 'lucide-svelte';
	import SearchBar from '$lib/shared/SearchBar.svelte';

	let isDialogOpen = false;
	const closeDialog = () => {
		isDialogOpen = false;
	};

	let object1 = {
		customer_company_name: 'Ταβέρνα - Τα 12 προβατάκια',
		customer_code: 'Π-302',
		email: 'provatakia@gmail.com',
		phone: '2310123456',
		afm: '123456789',
		active: true
	};

	let object2 = {
		customer_company_name: 'Εστιατόριο - Τρώγοντας έρχεται η όρεξη',
		customer_code: 'Π-252',
		email: 'oreksi@gmail.com',
		phone: '2310654321',
		afm: '987654321',
		active: false
	};
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
	<Dialog.Root bind:open={isDialogOpen}>
		<Dialog.Trigger class="text-base font-normal">
			<Button class="w-10 grow-0 border bg-transparent p-0 text-muted-foreground">
				<Plus />
			</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header class="mb-2.5">
				<Dialog.Title>Προσθήκη νέου πελάτη</Dialog.Title>
			</Dialog.Header>
			<AddNewCustomer />
			<Dialog.Footer>
				<Button variant="secondary" on:click={closeDialog}>Ακύρωση</Button>
				<Button type="submit">Προσθήκη</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>
<div class="p-2.5 pt-0">
	<div class="w-full divide-y overflow-hidden rounded-lg border">
		<CustomerEntry object={object1} />
		<CustomerEntry object={object2} />
		<CustomerEntry object={object2} />
		<CustomerEntry object={object2} />
		<CustomerEntry object={object2} />
		<CustomerEntry object={object2} />
		<CustomerEntry object={object2} />
	</div>
</div>
