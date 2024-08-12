<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { cart } from '../../stores/cartStore';
	import * as Select from '$lib/components/ui/select';
	import type { Selected } from 'bits-ui';

	export let id: number;
	export let sale_units: string[] = ['kg'];

	// Flag to check if this input instance is currently being edited
	let isCurrentlyBeingEdited = false;

	// Bind this to the Input component's value
	let inputValue: number = cart.getItemQuantity(id);

	let defaultValue: 'kg' | 'piece' | 'crates';
	const unitLabels: { [key: string]: string } = {
		kg: 'kg',
		piece: 'τεμ',
		crates: 'τελ'
	};
	// Determine the default selection based on the priority
	if (sale_units.includes('kg')) {
		defaultValue = 'kg';
	} else if (sale_units.includes('piece')) {
		defaultValue = 'piece';
	} else if (sale_units.includes('crates')) {
		defaultValue = 'crates';
	} else {
		defaultValue = 'kg';
	}

	/* If this input instance is not currently being edited and the quantity value in the
	 * CartStore changes update the inputValue to reflect this change.
	 *
	 * If it is being edited, we don't want to get and set the latest value from the CartStore
	 * as this causes problems and prevents the user from being able to change the value
	 * in the input field and therefore in the CartStore.
	 */
	$: if (!isCurrentlyBeingEdited) {
		$cart, (inputValue = cart.getItemQuantity(id));
	}

	// Function to validate the quantity input value
	const validateQuantity = () => {
		// Keep the quantity value between 1 and 999
		if (inputValue < 1) {
			inputValue = 1;
		} else if (inputValue > 999) {
			inputValue = 999;
		}
		// Update the quantity value in the CartStore
		cart.updateItemQuantity(id, inputValue);
		// Reset the isCurrentlyBeingEdited flag
		isCurrentlyBeingEdited = false;
	};

	function handleSelectedChange(s: Selected<string> | undefined) {
		// if (s && s.value !== previousSelection.value) {
		// 	previousSelection = s; // Keep track of previous value to avoid sending reqeusts for the same category
		// 	category = s.value;
		// 	fetchProducts(true);
		// }
		console.log(s);
	}
	let defaultSelection = { value: defaultValue, label: unitLabels[defaultValue] };
	// let previousSelection = defaultSelection as Selected<string>;
</script>

<div class="relative flex w-[110px] flex-grow items-center gap-2 sm:w-[120px]">
	<Input
		class="pr-2 text-center text-base font-semibold text-zinc-700"
		placeholder=""
		type="number"
		min={1}
		max={999}
		bind:value={inputValue}
		on:blur={validateQuantity}
		on:click={() => {
			isCurrentlyBeingEdited = true;
		}}
		on:focus={() => {
			isCurrentlyBeingEdited = true;
		}}
	/>
	{#if sale_units.length > 1}
		<Select.Root bind:selected={defaultSelection} onSelectedChange={(s) => handleSelectedChange(s)}>
			<Select.Input />
			<Select.Trigger class="w-full p-1">
				<Select.Value />
			</Select.Trigger>
			<Select.Content sameWidth={false} align="end" alignOffset={4} class="w-[110px] sm:w-[120px]">
				{#each sale_units as unit}
					<Select.Item value={unit} label={unitLabels[unit]} />
				{/each}
			</Select.Content>
		</Select.Root>
	{:else}
		<p class="pointer-events-none absolute right-0 flex pr-2 text-base font-semibold text-zinc-700">
			{#if sale_units.includes('kg')}
				kg
			{:else if sale_units.includes('piece')}
				τεμ
			{:else if sale_units.includes('crates')}
				τελ
			{:else}
				kg
			{/if}
		</p>
	{/if}
</div>
