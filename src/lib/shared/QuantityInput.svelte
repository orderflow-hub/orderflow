<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { cart } from '../../stores/cartStore';

	export let id: number;
	export let sale_unit: string = 'kg';

	// Flag to check if this input instance is currently being edited
	let isCurrentlyBeingEdited = false;

	// Bind this to the Input component's value
	let inputValue: number = cart.getItemQuantity(id);

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
</script>

<div class="relative flex w-[110px] flex-grow items-center sm:w-[120px]">
	<Input
		class="pr-10 text-center text-base text-base font-semibold text-zinc-700"
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
	<p class="pointer-events-none absolute right-0 flex pr-2 text-base font-semibold text-zinc-700">
		{sale_unit === 'piece' ? 'τεμ' : 'kg'}
	</p>
</div>
