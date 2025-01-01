<script lang="ts">
	import '@fontsource-variable/manrope';
	import '../app.pcss';
	import Navbar from '$lib/components/Navbar.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import { page } from '$app/stores';
	import { saleUnitsStore } from '$stores/saleUnitsStore';

	let headerText: string;

	// Change the header text based on the current page
	$: if ($page.url.pathname === '/') {
		headerText = 'Αρχική';
	} else if ($page.url.pathname.startsWith('/products')) {
		headerText = 'Προϊόντα';
	} else if ($page.url.pathname.startsWith('/orders')) {
		headerText = 'Παραγγελίες';
	} else if ($page.url.pathname.startsWith('/customers')) {
		headerText = 'Πελάτες';
	} else if ($page.url.pathname.startsWith('/profile')) {
		headerText = 'Προφίλ';
	} else {
		headerText = '';
	}

	setMode('light');

	// Retrieve user role from the server
	export let data;
	const userRole = data.userRole;

	// Populate the Sale Units store
	const saleUnits = data.saleUnits;
	saleUnitsStore.setSaleUnits(saleUnits);
</script>

<div class="flex min-h-screen flex-col items-center">
	{#if userRole}
		<header
			class="flex h-10 w-full flex-col items-center justify-center bg-secondary-foreground text-background"
		>
			<div class="flex w-full px-2.5">{headerText}</div>
		</header>
	{/if}

	<main class="box-border flex w-full flex-col items-stretch justify-start pb-12">
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
