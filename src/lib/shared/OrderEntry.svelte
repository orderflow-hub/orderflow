<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import type { Order } from '$lib/types';
	import { returnToHome } from '$stores/orderNavigationStore';

	export let order: Order;
	export let userRole: string;

	function navigateToOrderDetails() {
		returnToHome.set(window.location.pathname === '/');
	}

	const formattedDateTime = new Date(order.timestamp)
		.toLocaleString('el-GR', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		})
		.replace(',', ' •');
</script>

<Card.Root class="flex rounded-none border-0">
	<a
		href={`/orders/${order.orderId}`}
		on:click={navigateToOrderDetails}
		class="flex w-full flex-col"
	>
		<Card.Header class="px-3 pt-3 ">
			{#if userRole === 'admin'}
				<Card.Title class="text-lg font-normal">{order.companyName} #{order.orderId}</Card.Title>
			{:else}
				<Card.Title class="text-lg font-normal">#{order.userOrderNumber}</Card.Title>
			{/if}
			<Card.Description class="text-[13px] font-normal text-slate-400"
				>{formattedDateTime}</Card.Description
			>
		</Card.Header>
		<Card.Footer class="inline-flex items-center justify-start gap-1.5 px-3 pb-3">
			<div
				class={cn('h-2.5 w-2.5 rounded-full', {
					'bg-green-500': order.status === 'complete',
					'bg-amber-400': order.status === 'pending'
				})}
			></div>
			<p class="text-[12px] font-normal text-slate-400">
				{#if order.status === 'complete'}
					ΟΛΟΚΛΗΡΩΘΗΚΕ
				{:else}
					ΕΚΚΡΕΜΕΙ
				{/if}
			</p>
		</Card.Footer>
	</a>
</Card.Root>
