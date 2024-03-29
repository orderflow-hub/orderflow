<script>
    import { Search } from 'lucide-svelte';
    import Input from '$lib/components/ui/input/input.svelte';
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

    const formattedDateTime = `${dateStringInGreek} • ${timeString}`;

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

    // If the user is a customer, just load different data
    // The interface stays the same
    if (userRole === "customer") {
        object1.entry_title = "#123";
        object2.entry_title = "#456";
    }
</script>

<div class="flex items-center sticky top-0 p-2.5 bg-white">
    <div class="relative flex flex-grow items-center">
        <Input class="pl-10 text-base" placeholder="Αναζήτηση" type="search"/>
        <div class="absolute left-2.5 w-10 p-0 inset-y-0 flex items-center pointer-events-none text-muted-foreground">
            <Search size={18}/>
        </div>
    </div>
</div>
<div class="p-2.5 pt-0">
    <div class="w-full rounded-lg border divide-y overflow-hidden">
        <OrderEntry object={object1} />
        <OrderEntry object={object2} />
        <OrderEntry object={object1} />
        <OrderEntry object={object2} />
        <OrderEntry object={object2} />
        <OrderEntry object={object2} />
        <OrderEntry object={object2} />
        <OrderEntry object={object2} />
    </div>
</div>
