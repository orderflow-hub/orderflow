<script lang="ts">
    import * as Card from "$lib/components/ui/card";

    export let object = {
        image: "https://farzana.ae/images/thumbs/0005177_spinach-green-silik_500.jpeg",
        product_name: "ΣΠΑΝΑΚΙ",
        product_code: "ΕΙΔΗ-000000023",
        isAvailable: true,
        sale_unit: "piece"
    }
</script>
   
<Card.Root class={`flex h-24 rounded-none items-center justify-start ${object.isAvailable ? "" : "grayscale"}`}>
    <Card.Content class="py-0 px-2 h-full">
        <div class="w-full h-full flex-grow flex-col justify-start items-start gap-2.5">
            <img class="h-full object-cover" src={object.image} alt="Fresh tomatoes"/>
        </div>
    </Card.Content>
    <Card.Header class="p-0">
        <Card.Title class="oultine outline-blue">{object.product_name}</Card.Title>
        <Card.Description>{object.product_code}</Card.Description>
    </Card.Header>
</Card.Root>