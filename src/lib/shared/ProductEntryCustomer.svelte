<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";

    export let object = {
        image: "https://farzana.ae/images/thumbs/0005177_spinach-green-silik_500.jpeg",
        product_name: "ΣΠΑΝΑΚΙ",
        product_code: "ΕΙΔΗ-000000023",
        isAvailable: true,
        sale_unit: "piece"
    }
   
</script>

<Card.Root class={`w-auto p-2 ${object.isAvailable ? "" : "grayscale"}`}>
    <Card.Content class="p-0">
        <div class="flex flex-col p-0">
            <div>
                <img class="w-full object-cover" src={object.image} alt={object.product_name}/>
            </div>
        </div>
    </Card.Content>
    <Card.Header class="p-0 space-y-0">
        <Card.Title class="oultine outline-blue p-0">{object.product_name}</Card.Title>
        <Card.Description>{object.product_code}</Card.Description>
    </Card.Header>
    <Card.Footer class="p-0 mt-2">
        <Button class="w-full" variant="secondary">Προσθήκη</Button>
    </Card.Footer>
</Card.Root>