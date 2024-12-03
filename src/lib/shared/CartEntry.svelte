<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import QuantityInput from '$lib/shared/QuantityInput.svelte';
	import type { Product } from '$lib/types';
	import { Image } from 'lucide-svelte';

	export let product: Product;
</script>

<Card.Root class="flex items-center justify-between gap-2 rounded-none border-0 p-3">
	<div class="flex h-full items-center justify-start">
		<Card.Content class="aspect-square h-[72px] p-0">
			{#if product.imageUrl}
				<img
					class={cn('w-full object-cover', {
						grayscale: product.isDisabled
					})}
					src={product.imageUrl}
					alt="Εικόνα προϊόντος"
				/>
			{:else}
				<div class="flex w-full items-center justify-center object-cover">
					<Image strokeWidth={0.6} class="h-full w-full object-contain" />
				</div>
			{/if}
		</Card.Content>
		<Card.Header class="px-3 py-0">
			<Card.Title class="line-clamp-2 text-sm font-normal text-zinc-700"
				>{product.productName}</Card.Title
			>
			<Card.Description class="text-[13px] font-normal text-slate-400"
				>{product.productCode}</Card.Description
			>
		</Card.Header>
	</div>
	<Card.Footer class="inline-flex items-center justify-start p-0">
		<QuantityInput id={product.productId} sale_units={product.saleUnits} />
	</Card.Footer>
</Card.Root>
