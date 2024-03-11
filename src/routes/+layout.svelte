<script>
    import "../app.pcss";
    import Navbar from "$lib/components/Navbar.svelte";
</script>

<div class="flex flex-col min-h-screen">
    <header class="bg-secondary-foreground text-background flex justify-start items-center h-10 px-2.5">Αρχική</header>

    <main class="flex flex-col p-2.5 w-full max-w-4xl box-border pb-16">
        <slot />
    </main>

    <Navbar />
</div>
