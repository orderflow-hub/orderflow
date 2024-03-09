<script>
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";

    export let companyName = '';
    export let companyNameDisabled = false;
    export let customerId = '';
    export let customerIdDisabled = false;
    export let email = '';
    export let emailDisabled = false;
    export let phone = '';
    export let phoneDisabled = false;
    export let afm = '';
    export let afmDisabled = false;
</script>

<div class="self-stretch rounded-lg flex-col justify-center items-start flex">
    <div class="self-stretch rounded-lg flex-col justify-center items-start flex gap-4">
        <div class="flex w-full max-w-sm flex-col gap-1.5 ">
            <Label for="company-name">Επωνυμία</Label>
            <Input type="text" id="company-name" placeholder="" bind:value={companyName} disabled={companyNameDisabled} />
        </div>
        <div class="flex w-full max-w-sm flex-col gap-1.5 ">
            <Label for="customer-id">Κωδικός πελάτη</Label>
            <Input type="text" id="customer-id" placeholder="" bind:value={customerId} disabled={customerIdDisabled} />
        </div>
        <div class="flex w-full max-w-sm flex-col gap-1.5 ">
            <Label for="email">Email</Label>
            <Input type="email" id="email" placeholder="" bind:value={email} disabled={emailDisabled} />
        </div>
        <div class="flex gap-3">
            <div class="flex w-full max-w-sm flex-col gap-1.5 ">
                <Label for="phone">Τηλέφωνο</Label>
                <Input type="text" id="phone" placeholder="" bind:value={phone} disabled={phoneDisabled} />
            </div>
            <div class="flex w-full max-w-sm flex-col gap-1.5 ">
                <Label for="afm">ΑΦΜ</Label>
                <Input type="text" id="afm" placeholder="" bind:value={afm} disabled={afmDisabled} />
            </div>
        </div>
    </div>
</div>