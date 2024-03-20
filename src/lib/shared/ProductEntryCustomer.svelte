<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";
    import { cn } from "$lib/utils";
    import { Plus } from "lucide-svelte";

    export let object = {
        image: "https://www.alrizq.sa/wp-content/uploads/2022/10/SPINACH-BUNCH.jpg",
        product_name: "ΣΠΑΝΑΚΙ",
        product_code: "ΕΙΔΗ-000000023",
        isAvailable: true,
        sale_unit: "piece"
    }
   
</script>

<Card.Root class="w-auto p-2 flex flex-col justify-between">
    <div class="flex flex-col gap-3">
        <Card.Content class="p-0">
            <img class={cn("w-full aspect-square object-cover",
            {
                "grayscale" : !object.isAvailable
            })}
            src={object.image} alt="Εικόνα προϊόντος"/>
        </Card.Content>
        <Card.Header class="p-0 space-y-0">
            <Card.Title class={cn("text-zinc-700 font-normal line-clamp-2", {"text-slate-400": !object.isAvailable})}>{object.product_name}</Card.Title>
            <Card.Description class="text-slate-400 text-[13px] font-normal">{object.product_code}</Card.Description>
        </Card.Header>
    </div>
    <Card.Footer class="p-0 mt-2">
        <Button class={cn("w-full text-base gap-2 px-2")} variant="secondary" disabled={!object.isAvailable}><Plus />Προσθήκη</Button>
    </Card.Footer>
</Card.Root>