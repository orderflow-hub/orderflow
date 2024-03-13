<script>
    import { Search } from 'lucide-svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import OrderEntry from '$lib/shared/OrderEntry.svelte';

    let userRole = "customer";

    const now = new Date();
    const dateStringInGreek = now.toLocaleDateString('el-GR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    });

    const timeString = now.toLocaleTimeString('el-GR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
    });

    const formattedDateTime = `${dateStringInGreek} | ${timeString}`;

    let object1 = {
        entry_title: "Ταβέρνα - Τα 12 προβατάκια",
        timestamp: formattedDateTime,
        status: "complete",
    }

    let object2 = {
        entry_title: "Εστιατόριο - Τρώγοντας έρχεται η όρεξη",
        timestamp: formattedDateTime,
        status: "pending",
    }

    let object3 = {
        entry_title: "#304",
        timestamp: formattedDateTime,
        status: "complete",
    }

    let object4 = {
        entry_title: "#475",
        timestamp: formattedDateTime,
        status: "pending",
    }
</script>

{#if userRole === "admin"}
    <div class="relative flex flex-grow items-center mb-2">
        <Input class="pl-10" placeholder="Αναζήτηση" type="text"/>
        <div class="absolute left-2.5 w-10 p-0 inset-y-0 flex items-center pointer-events-none text-muted-foreground">
        <Search/>
        </div>
    </div>
    <ScrollArea class="w-full whitespace-nowrap rounded-lg border" orientation="vertical">
        <OrderEntry object={object1} />
        <OrderEntry object={object2} />
        <OrderEntry object={object1} />
        <OrderEntry object={object2} />
        <OrderEntry object={object2} />
    </ScrollArea>
    {:else if userRole === "customer"}
    <div class="relative flex flex-grow items-center mb-2">
        <Input class="pl-10" placeholder="Αναζήτηση" type="text"/>
        <div class="absolute left-2.5 w-10 p-0 inset-y-0 flex items-center pointer-events-none text-muted-foreground">
            <Search/>
        </div>
    </div>
    <ScrollArea class="w-full whitespace-nowrap rounded-lg border" orientation="vertical">
        <OrderEntry object={object3} />
        <OrderEntry object={object4} />
        <OrderEntry object={object3} />
        <OrderEntry object={object4} />
        <OrderEntry object={object4} />
    </ScrollArea>
{/if}
