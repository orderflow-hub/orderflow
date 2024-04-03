<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Customer } from '$lib/types';
	import { cn } from '$lib/utils';

	export let customer: Customer;
</script>

<Card.Root class="flex flex-col justify-center rounded-none border-0">
	<Card.Header class="px-3 pt-3">
		<Card.Title class="text-lg font-normal">{customer.company_name}</Card.Title>
		<Card.Description class="text-[13px] font-normal text-slate-400"
			>{customer.email}</Card.Description
		>
	</Card.Header>
	<Card.Footer class="inline-flex items-center justify-start gap-1.5 px-3 pb-3">
		<div
			class={cn('h-2.5 w-2.5 rounded-full', {
				'bg-green-500': !customer.is_account_disabled,
				'bg-red-600': customer.is_account_disabled
			})}
		></div>
		<p class="text-[12px] font-normal text-slate-400">
			{#if customer.is_account_disabled}
				ΕΝΕΡΓΟΣ
			{:else}
				ΑΠΕΝΕΡΓΟΠΟΙΗΜΕΝΟΣ
			{/if}
		</p>
	</Card.Footer>
</Card.Root>
