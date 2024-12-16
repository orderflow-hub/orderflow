<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { cart } from '../../stores/cartStore';
	import * as Select from '$lib/components/ui/select';
	import type { Selected } from 'bits-ui';
	import { createEventDispatcher, onDestroy } from 'svelte';

	export let id: number;
	export let sale_units: string[];

	const dispatch = createEventDispatcher();

	// Bind this to the Input component's value
	let inputValue: number = cart.getItemQuantity(id);

	const saleUnitLabels: { [key: string]: string } = {
		kg: 'Κιλά',
		piece: 'Τεμάχια',
		crate: 'Τελάρα',
		bunch: 'Ματσάκια',
		cup: 'Κουπάκια'
	};

	// Determine the default selection based on the priority
	let defaultSelection = {
		value: sale_units[0],
		label: saleUnitLabels[sale_units[0]]
	};

	// Function to validate the quantity input value
	function updateCartItemQuantity() {
		// Limits value to a range between 0.1 and 999
		inputValue = Math.max(0.1, Math.min(999, inputValue));

		// Update the quantity value in the CartStore
		cart.updateItemQuantity(id, inputValue);
	}

	function handleSelectedChange(s: Selected<string> | undefined) {
		if (s) {
			cart.updateItemSaleUnit(id, s.value);
			dispatch('saleUnitChange', { sale_unit: s.value });
		}
	}

	function selectInput(event: FocusEvent) {
		const target = event.target as HTMLInputElement;
		target.select();
	}

	// Subscribe to the cart store and update inputValue when the cart store changes
	const unsubscribe = cart.subscribe(() => {
		inputValue = cart.getItemQuantity(id);
		defaultSelection = { value: cart.getSaleUnit(id), label: saleUnitLabels[cart.getSaleUnit(id)] };
	});

	// Cleanup the subscription when the component is destroyed
	onDestroy(() => unsubscribe());
</script>

<div class="relative flex w-full items-center gap-2">
	<Input
		class="max-w-20 p-0 text-center font-semibold text-zinc-700"
		placeholder=""
		type="number"
		style="appearance: none; -moz-appearance: textfield;"
		bind:value={inputValue}
		on:blur={() => updateCartItemQuantity()}
		on:focus={selectInput}
	/>
	<Select.Root bind:selected={defaultSelection} onSelectedChange={(s) => handleSelectedChange(s)}>
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
				<Select.Item value={unit} label={saleUnitLabels[unit]} />
			{/each}
		</Select.Content>
	</Select.Root>
</div>
