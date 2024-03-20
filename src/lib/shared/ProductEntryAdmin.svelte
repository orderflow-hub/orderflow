<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { cn } from "$lib/utils";

    export let object = {
        image: "https://www.alrizq.sa/wp-content/uploads/2022/10/SPINACH-BUNCH.jpg",
        product_name: "ΣΠΑΝΑΚΙ",
        product_code: "ΕΙΔΗ-000000023",
        isAvailable: true,
        sale_unit: "piece"
    }
</script>
   
<Card.Root class="flex h-24 rounded-none items-center justify-start border-0 p-3 gap-4">
    <Card.Content class="p-0 h-full aspect-square">
        <img class={cn("h-full aspect-square object-cover",
        {
            "grayscale" : !object.isAvailable
        })}
        src={object.image} alt="Εικόνα προϊόντος"/>
    </Card.Content>
    <Card.Header class="p-0">
        <Card.Title class={cn("text-zinc-700 font-normal line-clamp-2", {"text-slate-400": !object.isAvailable})}>{object.product_name}</Card.Title>
        <Card.Description class="text-slate-400 text-[13px] font-normal">{object.product_code}</Card.Description>
    </Card.Header>
</Card.Root>