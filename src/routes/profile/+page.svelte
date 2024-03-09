<script>
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Separator } from "$lib/components/ui/separator";
    import { Button, buttonVariants } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog";
    import CustomerDetailsForm from "$lib/components/CustomerDetailsForm.svelte";
    import AdminDetailsForm from "$lib/components/AdminDetailsForm.svelte";

    let isChangePasswordDialogOpen = false;
    function closeChangePasswordDialog() {
        isChangePasswordDialogOpen = false;
    }

    // TODO: Fetch user data from backend
    let user = { role: 'admin', email: 'admin@example.com' };
    // let user = { role: 'customer', email: 'customer@example.com', companyName: 'Εταιρεία Α.Ε.', customerId: '123456', phone: '2101234567', afm: '123456789'};
</script>

<div class="flex flex-col justify-start items-stretch gap-4 flex p-1.5">
    {#if user.role === 'admin'}
        <AdminDetailsForm email={user.email} emailDisabled />
    {:else if user.role === 'customer'}
        <CustomerDetailsForm email={user.email} companyName={user.companyName} customerId={user.customerId} phone={user.phone} afm={user.afm}
        companyNameDisabled customerIdDisabled emailDisabled phoneDisabled afmDisabled/>
    {/if}
    <Separator />
    <div class="flex-col items-stretch gap-2.5 flex">
        <Dialog.Root bind:open={isChangePasswordDialogOpen}>
            <Dialog.Trigger class={`${buttonVariants({ variant: "secondary" })} text-base font-normal`}>Αλλαγή κωδικού</Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Header>
                    <Dialog.Title>Αλλαγή κωδικού</Dialog.Title>
                </Dialog.Header>
                <div class="flex flex-col gap-4 pt-2.5 pb-6">
                    <div class="flex w-full flex-col gap-1.5 ">
                        <Label for="old-password">Παλιός Κωδικός</Label>
                        <Input type="password" id="old-password" placeholder="" value=""/>
                    </div>
                    <div class="flex w-full flex-col gap-1.5 ">
                        <Label for="new-password">Νέος Κωδικός</Label>
                        <Input type="password" id="new-password" placeholder="" value=""/>
                    </div>
                </div>
                <Dialog.Footer>
                    <Button variant="secondary" on:click={closeChangePasswordDialog}>Ακύρωση</Button>
                    <Button type="submit">Αλλαγή κωδικού</Button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Root>
        <Button variant="destructive" class="text-base font-normal">Αποσύνδεση</Button>
    </div>
    <div class="flex py-4 justify-center">
        <p class="text-neutral-300 text-sm font-semibold">OrderFlow v1.0</p>
    </div>
</div>