<script>
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Select from "$lib/components/ui/select";
    import { Image } from "lucide-svelte";
    import { Checkbox } from "$lib/components/ui/checkbox";

    export let productName = '';
    export let productCode = '';
    export let sale_unit = '';
    export let isAvailable = false;
</script>

<div class="self-stretch rounded-lg flex-col justify-center items-start flex">
    <div class="self-stretch rounded-lg flex-col justify-center items-start flex gap-4">
        <Image class="border rounded-md w-20 h-20"/>
        <div class="flex w-full max-w-sm flex-col gap-1.5 ">
            <Label for="product-name">Όνομα προϊόντος</Label>
            <Input type="text" id="product-name" placeholder="" bind:value={productName}/>
        </div>
        <div class="flex gap-3 mb-3">
            <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label for="productCode">Κωδικός προϊόντος</Label>
                <Input type="text" id="productCode" placeholder="" bind:value={productCode}/>
            </div>
            <div class="flex w-full max-w-sm flex-col gap-1.5">
                <Label for="sale_unit">Μονάδα μέτρησης</Label>
                <Select.Root>
                    <Select.Trigger>
                      <Select.Value placeholder="Κιλό/Τεμ" />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="kg">Κιλό</Select.Item>
                      <Select.Item value="piece">Τεμάχιο</Select.Item>
                    </Select.Content>
                    <Select.Input name="sale_unit" />
                </Select.Root>
            </div>
        </div>
        <div class="items-top flex space-x-2 mb-3">
            <Checkbox id="isAvailable" class="border-input"/>
            <div class="grid gap-1.5 leading-none">
              <Label
                for="isAvailable"
                class="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive"
              >
                Το προϊόν δεν είναι διαθέσιμο
              </Label>
              <p class="text-xs text-muted-foreground">
                Το προϊόν θα εμφανίζεται στους πελάτες αλλά δε θα μπορούν να το προσθέσουν σε παραγγελίες τους.
              </p>
            </div>
        </div>
        
    </div>
</div>