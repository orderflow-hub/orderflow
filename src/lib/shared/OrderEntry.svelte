<script>
  import * as Card from "$lib/components/ui/card";

  export let status = "pending";
</script>

<Card.Root class="h-28 flex justify-center flex-col">
  <Card.Header class="px-3 pb-2">
    <Card.Title>Ταβέρνα - Μεζεδοπωλείο "Ο Μπάμπης"</Card.Title>
    <Card.Description>12 ΜΑΡ 2024 * 09:13</Card.Description>
  </Card.Header>
  <Card.Footer class="px-3 pt-2 text-sm">
    <div class={`w-2.5 h-2.5 rounded-full mr-2 ${status === "complete" ? "bg-green-500" : "bg-amber-400"}`}></div>
    <p>
      {#if status === "complete"}
        ΟΛΟΚΛΗΡΩΘΗΚΕ
      {:else}
        ΕΚΚΡΕΜΕΙ
      {/if}
    </p>
  </Card.Footer>
</Card.Root>