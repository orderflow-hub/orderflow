<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import QuantityInput from '$lib/shared/QuantityInput.svelte';
	import type { Product } from '$lib/types';
	import { Image } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Trash } from 'lucide-svelte';
	import { cart } from '$stores/cartStore';

	export let product: Product;

	const removeFromCart = () => {
		cart.removeItem(product.productId);
	};
</script>

<Card.Root class="rounded-none border-0 p-3">
	<!-- First Row -->
	<div class="flex items-center gap-3">
		<!-- Product Image -->
		<div class="h-16 w-16 flex-none">
			{#if product.imageUrl}
				<img
					src={product.imageUrl}
					alt={product.productName}
					class={cn('w-full object-cover', {
						grayscale: product.isDisabled
					})}
				/>
			{:else}
				<div class="flex w-full items-center justify-center object-cover">
					<Image strokeWidth={0.6} class="h-full w-full object-contain" />
				</div>
			{/if}
		</div>
		<!-- Title and Item ID -->
		<div class="grow">
			<div class="line-clamp-1 text-sm font-medium text-gray-800">{product.productName}</div>
			<div class="text-xs text-gray-500">{product.productCode}</div>
		</div>
		<!-- Price -->
		<div class="flex-none text-right text-sm font-semibold text-gray-700">
			{''}
		</div>
	</div>

	<!-- Second Row -->
	<div class="flex justify-between">
		<!-- Quantity and Sale Units -->
		<Card.Footer class="w-full p-0">
			<QuantityInput id={product.productId} sale_units={product.saleUnits} />
		</Card.Footer>
		<!-- Delete Button -->
		<Button variant="ghost" size="icon" on:click={removeFromCart}>
			<Trash class="h-5 w-5" />
		</Button>
	</div>
</Card.Root>
