<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import type { Product } from '$lib/types';
	import { saleUnitsStore } from '$stores/saleUnitsStore';

	export let product: Product;
	export let showImage: boolean = true;

	// Gets sale unit label from the store
	const saleUnitLabel = saleUnitsStore.getSaleUnitById(product.saleUnit)?.saleUnitLabel;
</script>

<Card.Root class="flex items-center justify-between gap-2 rounded-none border-0 p-3">
	<div class="flex h-full items-center justify-start">
		{#if showImage}
			<Card.Content class="aspect-square h-[72px] p-0">
				<img
					class={cn('aspect-square h-full object-cover', {
						grayscale: product.isDisabled
					})}
					src={product.imageUrl}
					alt="Εικόνα προϊόντος"
				/>
			</Card.Content>
		{/if}
		<Card.Header class="p-0">
			<Card.Title class="line-clamp-2 text-sm font-normal text-zinc-700"
				>{product.productName}</Card.Title
			>
			<Card.Description class="text-[13px] font-normal text-slate-400"
				>{product.productCode}</Card.Description
			>
		</Card.Header>
	</div>
	<Card.Footer class="flex items-center justify-start p-0">
		<div class="flex items-center justify-center gap-1.5 rounded bg-zinc-100 p-2">
			<p class="text-center text-base font-semibold text-zinc-700">
				{product.qty}
			</p>

			<p class="text-center text-base font-semibold text-zinc-700">
				{saleUnitLabel}
			</p>
		</div>
	</Card.Footer>
</Card.Root>
