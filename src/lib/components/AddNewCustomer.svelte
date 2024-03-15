<script>
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Select from "$lib/components/ui/select";
    import { Image } from "lucide-svelte";
    import { Checkbox } from "$lib/components/ui/checkbox";

    export let object = {
        customer_company_name: "",
        customer_code: "",
        email: "",
        phone: "",
        afm: "",
        active: true
    }
</script>

<div class="self-stretch rounded-lg flex-col justify-center items-stasrt flex">
    <div class="self-stretch rounded-lg flex-col justify-center items-start flex gap-4">
        <div class="flex w-full max-w-sm flex-col gap-1.5 ">
            <Label for="customer-company-name">Όνομα προϊόντος</Label>
            <Input type="text" id="customer-company-name" placeholder="" bind:value={object.customer_company_name}/>
        </div>
        <div class="flex w-full max-w-sm flex-col gap-1.5 ">
            <Label for="customer-code">Κωδικός πελάτη</Label>
            <Input type="text" id="customer-code" placeholder="" bind:value={object.customer_code}/>
        </div>
        <div class="flex w-full max-w-sm flex-col gap-1.5 ">
            <Label for="email">Email</Label>
            <Input type="text" id="email" placeholder="" bind:value={object.email}/>
        </div>
        <div class="flex gap-3 mb-3">
            <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label for="phone">Τηλέφωνο</Label>
                <Input type="text" id="phone" placeholder="" bind:value={object.phone}/>
            </div>
            <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label for="afm">ΑΦΜ</Label>
                <Input type="text" id="afm" placeholder="" bind:value={object.afm}/>
            </div>
        </div>
    </div>
</div>