<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import { Plus, Trash } from 'lucide-svelte';
	import type { Product } from '$lib/types';
	import QuantityInput from '$lib/shared/QuantityInput.svelte';
	import { cart } from '../../stores/cartStore';
	import { Image } from 'lucide-svelte';

	export let product: Product;

	// Local variable to store the quantity of the product in the cart
	// Used to conditionally render the Add to Cart button or the QuantityInput component
	let quantity: number;

	// Update the quantity variable when the quantity of the product in the cart changes
	$: $cart, (quantity = cart.getItemQuantity(product.product_id));

	const addToCart = () => {
		cart.addItem(product);
	};

	const removeFromCart = () => {
		cart.removeItem(product.product_id);
	};
</script>

<Card.Root class="flex w-auto flex-col justify-between p-2">
	<div class="flex flex-col gap-3">
		<Card.Content class="p-0">
			{#if product.image_url}
				<img
					class={cn('aspect-square h-full object-cover', {
						grayscale: product.is_disabled
					})}
					src={product.image_url}
					alt="Εικόνα προϊόντος"
				/>
			{:else}
				<div class="flex h-full w-full items-center justify-center">
					<Image strokeWidth={0.6} size={158.2} />
				</div>
			{/if}
		</Card.Content>
		<Card.Header class="space-y-0 p-0">
			<Card.Title
				class={cn('line-clamp-2 font-normal leading-normal text-zinc-700', {
					'text-slate-400': product.is_disabled
				})}>{product.product_name}</Card.Title
			>
			<Card.Description class="text-[13px] font-normal text-slate-400"
				>{product.product_code}</Card.Description
			>
		</Card.Header>
	</div>
	<Card.Footer class="mt-2 p-0">
		{#if quantity > 0}
			<div class="inline-flex w-full items-center justify-center gap-2">
				<Button class="p-3" variant="secondary" on:click={removeFromCart}
					><Trash size={18} /></Button
				>
				<QuantityInput id={product.product_id} sale_unit={product.sale_unit} />
			</div>
		{:else}
			<Button
				class="w-full gap-2 px-2 text-base"
				variant="secondary"
				disabled={product.is_disabled}
				on:click={addToCart}
			>
				{#if product.is_disabled}
					Μη διαθέσιμο
				{:else}
					<Plus />Προσθήκη
				{/if}
			</Button>
		{/if}
	</Card.Footer>
</Card.Root>
