<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import type { Product } from '$lib/types';
	import { Image } from 'lucide-svelte';

	export let product: Product;
</script>

<Card.Root class="flex rounded-none border-0">
	<a
		href={`/products/${product.product_id}`}
		class="flex h-24 w-full items-center justify-start gap-4 p-3"
	>
		<Card.Content class="aspect-square h-full p-0">
			{#if product.image_url}
				<img
					class={cn('aspect-square w-full object-cover', {
						grayscale: product.is_disabled
					})}
					src={product.image_url}
					alt="Εικόνα προϊόντος"
				/>
			{:else}
				<div class="flex w-full items-center justify-center">
					<Image strokeWidth={1} class="h-full w-full object-contain" />
				</div>
			{/if}
		</Card.Content>
		<Card.Header class="p-0">
			<Card.Title
				class={cn('line-clamp-2 font-normal text-zinc-700', {
					'text-slate-400': product.is_disabled
				})}>{product.product_name}</Card.Title
			>
			<Card.Description class="text-[13px] font-normal text-slate-400"
				>{product.product_code}</Card.Description
			>
		</Card.Header>
	</a>
</Card.Root>
