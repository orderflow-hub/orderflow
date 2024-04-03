<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import QuantityInput from '$lib/shared/QuantityInput.svelte';
	import type { Product } from '$lib/types';

	export let product: Product;
</script>

<Card.Root class="flex items-center justify-start justify-between gap-2 rounded-none border-0 p-3">
	<div class="flex h-full items-center justify-start">
		<Card.Content class="aspect-square h-[72px] p-0">
			<img
				class={cn('aspect-square h-full object-cover', {
					grayscale: !product.is_available
				})}
				src={product.image_url}
				alt="Εικόνα προϊόντος"
			/>
		</Card.Content>
		<Card.Header class="px-3 py-0">
			<Card.Title class="line-clamp-2 text-sm font-normal text-zinc-700"
				>{product.product_name}</Card.Title
			>
			<Card.Description class="text-[13px] font-normal text-slate-400"
				>{product.product_code}</Card.Description
			>
		</Card.Header>
	</div>
	<Card.Footer class="inline-flex items-center justify-start p-0">
		<QuantityInput id={product.product_id} sale_unit={product.sale_unit} />
	</Card.Footer>
</Card.Root>
