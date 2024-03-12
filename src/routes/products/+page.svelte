<script>
    import ProductEntry from '$lib/shared/ProductEntry.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
    import {Plus} from 'lucide-svelte';
	import {Button} from '$lib/components/ui/button';
    import * as Dialog from '$lib/components/ui/dialog';
    import AddNewProduct from '$lib/components/AddNewProduct.svelte';

    let userRole = 'admin';
    let isDialogOpen = false;
    const closeDialog = () => {
        isDialogOpen = false;
    }
</script>

{#if userRole === 'admin'}
    <div class="flex items-center pt-0 pb-4">
        <Input class="mr-2.5" placeholder="Αναζήτηση" type="text"/>
        <Dialog.Root bind:open={isDialogOpen}>
            <Dialog.Trigger class="text-base font-normal">
                <Button class="w-10 p-0  grow-0 border-2 text-card-foreground bg-transparent">
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
    <ScrollArea class="w-full whitespace-nowrap rounded-lg border" orientation="vertical">
        <ProductEntry isAvailable={true}/>
        <ProductEntry isAvailable={true}/>
        <ProductEntry isAvailable={true}/>
        <ProductEntry isAvailable={false}/>
        <ProductEntry isAvailable={false}/>
        <ProductEntry isAvailable={false}/>
    </ScrollArea>
{/if}