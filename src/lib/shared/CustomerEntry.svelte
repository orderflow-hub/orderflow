<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';

	export let object = {
		customer_company_name: 'Ταβέρνα - Τα 12 προβατάκια',
		customer_code: 'Π-302',
		email: 'provatakia@gmail.com',
		phone: '2310123456',
		afm: '123456789',
		active: true
	};
</script>

<Card.Root class="flex rounded-none border-0">
	<a href={`/customers/${2}`} class="flex w-full flex-col">
		<Card.Header class="px-3 pt-3">
			<Card.Title class="text-lg font-normal">{object.customer_company_name}</Card.Title>
			<Card.Description class="text-[13px] font-normal text-slate-400"
				>{object.email}</Card.Description
			>
		</Card.Header>
		<Card.Footer class="inline-flex items-center justify-start gap-1.5 px-3 pb-3">
			<div
				class={cn('h-2.5 w-2.5 rounded-full', {
					'bg-green-500': object.active,
					'bg-red-600': !object.active
				})}
			></div>
			<p class="text-[12px] font-normal text-slate-400">
				{#if object.active}
					ΕΝΕΡΓΟΣ
				{:else}
					ΑΠΕΝΕΡΓΟΠΟΙΗΜΕΝΟΣ
				{/if}
			</p>
		</Card.Footer>
	</a>
</Card.Root>
