<script>
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';

	export let object = {
		entry_title: 'Ταβέρνα - Τα 12 προβατάκια',
		timestamp: new Date().toDateString(),
		status: 'complete'
	};
</script>

<Card.Root class="flex rounded-none border-0">
	<a href={`/orders/${2}`} class="flex w-full flex-col">
		<Card.Header class="px-3 pt-3 ">
			<Card.Title class="text-lg font-normal">{object.entry_title}</Card.Title>
			<Card.Description class="text-[13px] font-normal text-slate-400"
				>{object.timestamp}</Card.Description
			>
		</Card.Header>
		<Card.Footer class="inline-flex items-center justify-start gap-1.5 px-3 pb-3">
			<div
				class={cn('h-2.5 w-2.5 rounded-full', {
					'bg-green-500': object.status === 'complete',
					'bg-amber-400': object.status === 'pending'
				})}
			></div>
			<p class="text-[12px] font-normal text-slate-400">
				{#if object.status === 'complete'}
					ΟΛΟΚΛΗΡΩΘΗΚΕ
				{:else}
					ΕΚΚΡΕΜΕΙ
				{/if}
			</p>
		</Card.Footer>
	</a>
</Card.Root>
