<script lang="ts">
	import OrderEntry from '$lib/shared/OrderEntry.svelte';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Order } from '$lib/types';

	export let data;
	const userRole: string = data.userRole;
	const orders: Order[] = data.orders;
	const activeProductCount: Number = data.activeProductCount;
	const inactiveProductCount: Number = data.inactiveProductCount;
	const totalProductCount: number = Number(activeProductCount) + Number(inactiveProductCount);

	onMount(() => {
		if (userRole === 'customer') {
			goto('/orders');
		}
	});
</script>

<div class="p-2.5">
	<Card.Root class="overflow-hidden">
		<Card.Header class="border-b p-0">
			<Card.Title class="flex h-10 items-center justify-center bg-secondary font-normal">
				Ιστορικό Πωλήσεων
			</Card.Title>
		</Card.Header>
		<Card.Content class="divide-y p-0">
			{#each orders as order}
				<OrderEntry {order} {userRole} />
			{/each}
		</Card.Content>
		<Card.Footer class="border-t p-0">
			<Button
				class="w-full rounded-none text-base"
				on:click={() => {
					goto('/orders');
				}}>Προβολή όλων</Button
			>
		</Card.Footer>
	</Card.Root>

	<Card.Root class="mt-2.5 overflow-hidden">
		<Card.Header class="p-0">
			<Card.Title class="flex h-10 items-center justify-center border-b bg-secondary font-normal">
				Προϊόντα
			</Card.Title>
		</Card.Header>
		<Card.Content class="p-0">
			<div class="flex justify-between p-2.5 text-zinc-700">
				<span>Ενεργά προϊόντα</span>
				<span>{activeProductCount}</span>
			</div>
			<div class="flex justify-between p-2.5 text-destructive">
				<span>Ανενεργά προϊόντα</span>
				<span>{inactiveProductCount}</span>
			</div>
			<Separator class="h-[0.8px] bg-neutral-200" />
			<div class="flex justify-between p-2.5 text-zinc-700">
				<span>Σύνολο</span>
				<span>{totalProductCount}</span>
			</div>
		</Card.Content>
	</Card.Root>
</div>
