<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import { Plus, Trash } from 'lucide-svelte';
	import type { Product } from '$lib/types';
	import QuantityInput from '$lib/shared/QuantityInput.svelte';
	import { cart } from '../../stores/cartStore';

	export let object: Product;

	// Local variable to store the quantity of the product in the cart
	// Used to conditionally render the Add to Cart button or the QuantityInput component
	let quantity: number;

	// Update the quantity variable when the quantity of the product in the cart changes
	$: $cart, (quantity = cart.getItemQuantity(object.id));

	const addToCart = () => {
		cart.addItem(object);
	};

	const removeFromCart = () => {
		cart.removeItem(object.id);
	};
</script>

<Card.Root class="flex w-auto flex-col justify-between p-2">
	<div class="flex flex-col gap-3">
		<Card.Content class="p-0">
			<img
				class={cn('aspect-square w-full object-cover', {
					grayscale: !object.isAvailable
				})}
				src={object.image}
				alt="Εικόνα προϊόντος"
			/>
		</Card.Content>
		<Card.Header class="space-y-0 p-0">
			<Card.Title
				class={cn('line-clamp-2 font-normal text-zinc-700', {
					'text-slate-400': !object.isAvailable
				})}>{object.product_name}</Card.Title
			>
			<Card.Description class="text-[13px] font-normal text-slate-400"
				>{object.product_code}</Card.Description
			>
		</Card.Header>
	</div>
	<Card.Footer class="mt-2 p-0">
		{#if quantity > 0}
			<div class="inline-flex w-full items-center justify-center gap-2">
				<Button class="p-3" variant="secondary" on:click={removeFromCart}
					><Trash size={18} /></Button
				>
				<QuantityInput id={object.id} sale_unit={object.sale_unit} />
			</div>
		{:else}
			<Button
				class="w-full gap-2 px-2 text-base"
				variant="secondary"
				disabled={!object.isAvailable}
				on:click={addToCart}
			>
				{#if !object.isAvailable}
					Μη διαθέσιμο
				{:else}
					<Plus />Προσθήκη
				{/if}
			</Button>
		{/if}
	</Card.Footer>
</Card.Root>
