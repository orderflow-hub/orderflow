<script>
    import ProductEntryAdmin from '$lib/shared/ProductEntryAdmin.svelte';
    import ProductEntryCustomer from '$lib/shared/ProductEntryCustomer.svelte';
    import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
    import {Plus} from 'lucide-svelte';
	import {Button} from '$lib/components/ui/button';
    import * as Dialog from '$lib/components/ui/dialog';
    import AddNewProduct from '$lib/components/AddNewProduct.svelte';
	import SearchBar from '$lib/shared/SearchBar.svelte';

    let isDialogOpen = false;
    const closeDialog = () => {
        isDialogOpen = false;
    }

    let userRole = 'admin';

    let object1 = {
        image: "https://farzana.ae/images/thumbs/0005177_spinach-green-silik_500.jpeg",
        product_name: "ΣΠΑΝΑΚΙ",
        product_code: "ΕΙΔΗ-000000023",
        isAvailable: true,
        sale_unit: "piece"
    }

    let object2 = {
        image: "https://www.doorsteporganics.com.au/image/optimised/large/Tomatoes-Round-1kg.jpg",
        product_name: "ΝΤΟΜΑΤΕΣ ΚΡΗΤΗΣ",
        product_code: "ΕΙΔΗ-000000024",
        isAvailable: false,
        sale_unit: "kg"
    }

</script>

{#if userRole === 'admin'}
    <div class="flex items-center pt-0 pb-2">
        <SearchBar/>
        <Dialog.Root bind:open={isDialogOpen}>
            <Dialog.Trigger class="text-base font-normal">
                <Button class="w-10 p-0 grow-0 border-2 text-muted-foreground bg-transparent">
                    <Plus/>
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
    <ScrollArea class="w-full whitespace-nowrap rounded-lg border" orientation="vertical">
        <ProductEntryAdmin object={object1}/>
        <ProductEntryAdmin object={object1}/>
        <ProductEntryAdmin object={object1}/>
        <ProductEntryAdmin object={object1}/>
        <ProductEntryAdmin object={object2}/>
        <ProductEntryAdmin object={object2}/>
    </ScrollArea>
{:else if userRole === 'customer'}
        <div class="relative flex flex-grow items-center mb-2">
            <SearchBar/>
        </div>
    <ScrollArea class="w-full whitespace-nowrap rounded-lg" orientation="vertical">
        <div class="grid grid-cols-2 gap-4">
            <ProductEntryCustomer object={object1}/>
            <ProductEntryCustomer object={object1}/>
            <ProductEntryCustomer object={object1}/>
            <ProductEntryCustomer object={object2}/>
            <ProductEntryCustomer object={object2}/>
        </div>
    </ScrollArea>
{/if}