<script lang="ts">
	import '@fontsource-variable/manrope';
	import '../app.pcss';
	import Navbar from '$lib/components/Navbar.svelte';
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase';
	import { authStore } from '../stores/authStore';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher, setMode } from 'mode-watcher';

	let showNavbar = false;

	onMount(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			authStore.update((curr) => {
				return {
					...curr,
					currentUser: user
				};
			});

			if ($authStore.currentUser) {
				showNavbar = true;
			}
		});
		return unsubscribe;
	});

	setMode('light');

	// Retrieve user role from the server
	export let data;
	const userRole = data.userRole;
</script>

<div class="flex min-h-screen flex-col items-center">
	<header
		class="flex h-10 w-full flex-col items-center justify-center bg-secondary-foreground text-background"
	>
		<div class="flex w-full max-w-4xl px-2.5">Αρχική</div>
	</header>

	<main class="box-border flex w-full max-w-4xl flex-col items-stretch pb-12">
		<slot />
	</main>

	<ModeWatcher track={false} />
	<Toaster richColors position="top-center" duration={3000} />

	{#if userRole}
		<Navbar {userRole} />
	{/if}
</div>

<style>
	:global(body) {
		font-family: 'Manrope Variable', sans-serif;
	}
</style>
