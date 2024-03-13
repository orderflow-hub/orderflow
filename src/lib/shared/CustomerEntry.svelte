<script lang="ts">
    import * as Card from "$lib/components/ui/card";

    export let object = {
        customer_company_name: "Ταβέρνα - Τα 12 προβατάκια",
        customer_code: "Π-302",
        email: "provatakia@gmail.com",
        phone: "2310123456",
        afm: "123456789",
        active: true
    }
</script>
   
<Card.Root class="h-28 flex justify-center flex-col rounded-none">
    <Card.Header class="px-3 pb-2">
      <Card.Title>{object.customer_company_name}</Card.Title>
      <Card.Description>{object.email}</Card.Description>
    </Card.Header>
    <Card.Footer class="px-3 pt-2 text-sm">
      <div class={`w-2.5 h-2.5 rounded-full mr-2 ${object.active ? "bg-green-500" : "bg-red-600"}`}></div>
      <p>
        {#if object.active}
            ΕΝΕΡΓΟΣ
        {:else}
            ΑΠΕΝΕΡΓΟΠΟΙΗΜΕΝΟΣ
        {/if}
      </p>
    </Card.Footer>
  </Card.Root>