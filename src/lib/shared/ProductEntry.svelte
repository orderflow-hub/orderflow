<script lang="ts">
    import * as Card from "$lib/components/ui/card";

    export let isAvailable = true;
</script>
   
<Card.Root class={`flex h-24 items-center justify-start ${isAvailable ? "" : "grayscale"}`}>
    <Card.Content class="py-0 px-2 h-full">
        <div class="w-full h-full flex-grow flex-col justify-start items-start gap-2.5">
            <img class="h-full object-cover" src="https://www.doorsteporganics.com.au/image/optimised/large/Tomatoes-Round-1kg.jpg" alt="Fresh tomatoes"/>
        </div>
    </Card.Content>
    <Card.Header class="p-0">
        <Card.Title class="oultine outline-blue">ΝΤΟΜΑΤΕΣ ΚΡΗΤΗΣ</Card.Title>
        <Card.Description>ΕΙΔΗ-000000023</Card.Description>
    </Card.Header>
</Card.Root>