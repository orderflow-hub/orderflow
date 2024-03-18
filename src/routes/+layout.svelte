<script lang="ts">
    import "../app.pcss";
    import Navbar from "$lib/components/Navbar.svelte";
    import { onMount } from "svelte";
    import { auth } from "$lib/firebase";
    import { authStore } from "../stores/authStore";
    import { Toaster } from "$lib/components/ui/sonner";
    import { ModeWatcher, setMode } from 'mode-watcher';

    let showNavbar = false;

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            authStore.update((curr) => {
                return {
                    ...curr,
                    currentUser: user,
                };
            });

            if ($authStore.currentUser) {
                showNavbar = true;
            }
        });
        return unsubscribe;
    });

    setMode("light");

    // Retrieve user role from the server
    export let data;
    const userRole = data.userRole;
</script>

<div class="flex flex-col min-h-screen">
    <header class="bg-secondary-foreground text-background flex justify-start items-center h-10 px-2.5">Αρχική</header>

    <main class="flex flex-col p-2.5 w-full max-w-4xl box-border pb-16">
        <slot />
    </main>

    <ModeWatcher track={false}/>
    <Toaster richColors position="top-center" duration={3000} />

    {#if userRole}
        <Navbar {userRole}/>
    {/if}
</div>
