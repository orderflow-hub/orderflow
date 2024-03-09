
<script>
    import "../app.pcss";
    import Navbar from "$lib/components/Navbar.svelte";
</script>

<div class="flex flex-col min-h-screen">
    <header>Αρχική</header>

    <main class="flex flex-col p-4 w-full max-w-4xl box-border pb-16">
        <slot />
    </main>

    <Navbar />
</div>
