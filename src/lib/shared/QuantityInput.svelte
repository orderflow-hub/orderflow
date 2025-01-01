<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { cart } from '../../stores/cartStore';
	import * as Select from '$lib/components/ui/select';
	import type { Selected } from 'bits-ui';
	import { saleUnitsStore } from '$stores/saleUnitsStore';
	import { derived } from 'svelte/store';

	export let id: number;
	export let sale_units: string[];

	// Quantity of cart item
	let quantity = derived(cart, () => {
		return cart.getItemQuantity(id);
	});

	// Default selected unit of cart item
	let saleUnitSelection = derived(cart, () => {
		const currentSaleUnit = cart.getSaleUnit(id);
		const saleUnitLabel = saleUnitsStore.getSaleUnitById(currentSaleUnit)?.saleUnitLabel || '';
		return {
			value: currentSaleUnit,
			label: saleUnitLabel
		};
	});

	function updateCartItemQuantity(event: FocusEvent) {
		const target = event.target as HTMLInputElement;
		let value = parseFloat(target.value);

		// Limit the value to a range between 0.1 and 999
		value = Math.max(0.1, Math.min(999, value));

		// Update the quantity value in the CartStore
		cart.updateItemQuantity(id, value);
	}

	function handleSelectedChange(s: Selected<string> | undefined) {
		if (s) {
			cart.updateItemSaleUnit(id, s.value);
		}
	}

	function selectInput(event: FocusEvent) {
		const target = event.target as HTMLInputElement;
		target.select();
	}
</script>

<div class="relative flex w-full items-center gap-2">
	<Input
		class="max-w-20 p-0 text-center font-semibold text-zinc-700"
		placeholder=""
		type="number"
		style="appearance: none; -moz-appearance: textfield;"
		value={$quantity}
		on:blur={updateCartItemQuantity}
		on:focus={selectInput}
	/>
	<Select.Root selected={$saleUnitSelection} onSelectedChange={(s) => handleSelectedChange(s)}>
		<Select.Input />
		<Select.Trigger class="max-w-24 truncate p-1">
			<Select.Value class="" />
		</Select.Trigger>
		<Select.Content
			sameWidth={false}
			align="start"
			alignOffset={0}
			class="w-auto min-w-[110px] max-w-[200px]"
		>
			{#each sale_units as unit}
				<Select.Item value={unit} label={saleUnitsStore.getSaleUnitById(unit)?.saleUnitLabel} />
			{/each}
		</Select.Content>
	</Select.Root>
</div>
