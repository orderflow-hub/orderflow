<script>
  import * as Card from "$lib/components/ui/card";

  export let object = {
    entry_title: "Ταβέρνα - Τα 12 προβατάκια",
    timestamp: new Date().toDateString(),
    status: "complete",
  };
</script>

<Card.Root class="h-28 flex justify-center flex-col rounded-none">
  <Card.Header class="px-3 pb-2">
    <Card.Title>{object.entry_title}</Card.Title>
    <Card.Description>{object.timestamp}</Card.Description>
  </Card.Header>
  <Card.Footer class="px-3 pt-2 text-sm">
    <div class={`w-2.5 h-2.5 rounded-full mr-2 ${object.status === "complete" ? "bg-green-500" : "bg-amber-400"}`}></div>
    <p>
      {#if object.status === "complete"}
        ΟΛΟΚΛΗΡΩΘΗΚΕ
      {:else}
        ΕΚΚΡΕΜΕΙ
      {/if}
    </p>
  </Card.Footer>
</Card.Root>