<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import QuantityInput from '$lib/shared/QuantityInput.svelte';
	import type { Product } from '$lib/types';

	export let item: Product;
</script>

<Card.Root class="flex items-center justify-start justify-between gap-2 rounded-none border-0 p-3">
	<div class="flex h-full items-center justify-start">
		<Card.Content class="aspect-square h-[72px] p-0">
			<img
				class={cn('aspect-square h-full object-cover', {
					grayscale: !item.isAvailable
				})}
				src={item.image}
				alt="Εικόνα προϊόντος"
			/>
		</Card.Content>
		<Card.Header class="px-3 py-0">
			<Card.Title class="line-clamp-2 text-sm font-normal text-zinc-700"
				>{item.product_name}</Card.Title
			>
			<Card.Description class="text-[13px] font-normal text-slate-400"
				>{item.product_code}</Card.Description
			>
		</Card.Header>
	</div>
	<Card.Footer class="inline-flex items-center justify-start p-0">
		<QuantityInput id={item.id} sale_unit={item.sale_unit} />
	</Card.Footer>
</Card.Root>
