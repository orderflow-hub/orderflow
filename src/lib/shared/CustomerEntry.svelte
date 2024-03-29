<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { cn } from "$lib/utils";

    export let object = {
        customer_company_name: "Ταβέρνα - Τα 12 προβατάκια",
        customer_code: "Π-302",
        email: "provatakia@gmail.com",
        phone: "2310123456",
        afm: "123456789",
        active: true
    }
</script>
   
<Card.Root class="flex justify-center flex-col rounded-none border-0">
    <Card.Header class="px-3 pt-3">
      <Card.Title class="text-lg font-normal">{object.customer_company_name}</Card.Title>
      <Card.Description class="text-[13px] font-normal text-slate-400">{object.email}</Card.Description>
    </Card.Header>
    <Card.Footer class="px-3 pb-3 justify-start items-center gap-1.5 inline-flex">
      <div class={cn("w-2.5 h-2.5 rounded-full",
        {
          "bg-green-500": object.active,
          "bg-red-600": !object.active,
        })
      }></div>
      <p class="text-[12px] font-normal text-slate-400">
        {#if object.active}
            ΕΝΕΡΓΟΣ
        {:else}
            ΑΠΕΝΕΡΓΟΠΟΙΗΜΕΝΟΣ
        {/if}
      </p>
    </Card.Footer>
  </Card.Root>