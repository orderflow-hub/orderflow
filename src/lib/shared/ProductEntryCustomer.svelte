<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import { Plus, Trash } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	export let object = {
		image: 'https://www.alrizq.sa/wp-content/uploads/2022/10/SPINACH-BUNCH.jpg',
		product_name: 'ΣΠΑΝΑΚΙ',
		product_code: 'ΕΙΔΗ-000000023',
		isAvailable: true,
		sale_unit: 'piece'
	};

	let isAddedToCart = false;
	let quantity = 0;
	let lastValidQuantity = 1;

	const addToCart = () => {
		isAddedToCart = true;
		quantity = 1;
	};

	const removeFromCart = () => {
		isAddedToCart = false;
		quantity = 0;
	};

	const validateQuantity = () => {
		if (quantity < 1) {
			quantity = 1;
		} else if (quantity > 999) {
			quantity = 999;
		}
		lastValidQuantity = quantity;
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
		{#if isAddedToCart}
			<div class="inline-flex w-full items-center justify-center gap-2">
				<Button class="p-3" variant="secondary" on:click={removeFromCart}
					><Trash size={18} /></Button
				>
				<div class="relative flex flex-grow items-center">
					<Input
						class="pr-10 text-center text-base text-base font-semibold text-zinc-700"
						placeholder=""
						type="number"
						min={1}
						max={999}
						bind:value={quantity}
						on:blur={validateQuantity}
					/>
					<p
						class="pointer-events-none absolute right-0 flex pr-2 text-base font-semibold text-zinc-700"
					>
						{object.sale_unit === 'piece' ? 'τεμ.' : 'kg'}
					</p>
				</div>
			</div>
		{:else}
			<Button
				class="w-full gap-2 px-2 text-base"
				variant="secondary"
				disabled={!object.isAvailable}
				on:click={addToCart}><Plus />Προσθήκη</Button
			>
		{/if}
	</Card.Footer>
</Card.Root>
