<script>
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Select from "$lib/components/ui/select";
    import { Image } from "lucide-svelte";

    export let productName = '';

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
        <Image class="border rounded-md w-20 h-20"/>
        <div class="flex w-full max-w-sm flex-col gap-1.5 ">
            <Label for="product-name">Όνομα προϊόντος</Label>
            <Input type="text" id="product-name" placeholder="" bind:value={productName}/>
        </div>
        <div class="flex gap-3">
            <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label for="phone">Κωδικός προϊόντος</Label>
                <Input type="text" id="phone" placeholder="" bind:value={phone} disabled={phoneDisabled} />
            </div>
            <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label for="afm">Μονάδα μέτρησης</Label>
                <Select.Root>
                    <Select.Trigger>
                      <Select.Value placeholder="Κιλό/Τεμ" />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="kg">Κιλό</Select.Item>
                      <Select.Item value="piece">Τεμάχιο</Select.Item>
                    </Select.Content>
                </Select.Root>
            </div>
        </div>
        
    </div>
</div>