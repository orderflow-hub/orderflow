<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Image, Plus } from 'lucide-svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { productSchema } from '$lib/schemas/productSchema';
	import productsStore from '../../stores/productsStore';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import type { PageData } from './$types';
	import type { Selected } from 'bits-ui';
	import type { Product } from '$lib/types';

	// export let data: SuperValidated<Infer<FormProductSchema>>;
	export let data: PageData;

	if (!data.form) {
		throw new Error('Form error');
	}

	const form = superForm(data.form, {
		validators: zodClient(productSchema),
		resetForm: false,
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message) {
				if (form.message.status === 'success') {
					toast.success(form.message.text);

					// Adds new Product to Store
					const product: Product = {
						product_id: form.message.productId,
						product_name: $formData.productName,
						category: $formData.category,
						product_code: $formData.productCode,
						sale_units: $formData.saleUnits,
						is_disabled: $formData.isDisabled
					};
					productsStore.setProducts([product], false);

					// Hides form modal.
					isDialogOpen = false;
				} else {
					toast.error(form.message.text);
				}
			}
		}
	});

	const { form: formData, enhance } = form;

	function handleSaleUnitsChange(s: Selected<string>[] | undefined) {
		if (s) {
			// Map over selections to extract values
			const selectedValues = s.map((selection) => selection.value as 'kg' | 'piece' | 'crates');
			// Update $formData.saleUnits with the new selections
			$formData.saleUnits = selectedValues;
		} else {
			// If no selection, reset $formData.saleUnits to an empty array
			$formData.saleUnits = [];
		}
	}

	function handleCategoryChange(s: Selected<string> | undefined) {
		if (s) {
			$formData.category = s.value as 'fruits' | 'vegetables';
		}
	}

	$: saleUnitsSelection = $formData.saleUnits.map((unit) => ({
		value: unit,
		label: unit === 'piece' ? 'τεμάχιο' : unit === 'kg' ? 'κιλό' : 'τελάρο'
	}));

	$: categorySelection = {
		label:
			$formData.category === 'fruits'
				? 'Φρούτα'
				: $formData.category === 'vegetables'
					? 'Λαχανικά'
					: '',
		value:
			$formData.category === 'fruits'
				? 'fruits'
				: $formData.category === 'vegetables'
					? 'vegetables'
					: 'other'
	};

	let isDialogOpen = false;
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Trigger class="text-base font-normal">
		<Button class="w-10 grow-0 border bg-transparent p-0 text-muted-foreground">
			<Plus />
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header class="mb-2.5">
			<Dialog.Title>Προσθήκη νέου προϊόντος</Dialog.Title>
		</Dialog.Header>
		<form method="POST" action="?/createProduct" use:enhance>
			<div class="flex flex-col items-start justify-center gap-4 self-stretch rounded-lg">
				<Image class="rounded-md border" strokeWidth={1} size={80} />
				<Form.Field class="flex w-full max-w-sm flex-col" {form} name="productName">
					<Form.Control let:attrs>
						<Form.Label>Όνομα προϊόντος *</Form.Label>
						<Input {...attrs} bind:value={$formData.productName} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<div class="flex w-full gap-3">
					<Form.Field class="flex w-full max-w-sm flex-col" {form} name="productCode">
						<Form.Control let:attrs>
							<Form.Label>Κωδικός προϊόντος *</Form.Label>
							<Input {...attrs} bind:value={$formData.productCode} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field class="flex w-full max-w-sm flex-col" {form} name="saleUnits">
						<Form.Control let:attrs>
							<Form.Label>Μονάδα μέτρησης *</Form.Label>
							<Select.Root
								bind:selected={saleUnitsSelection}
								multiple={true}
								onSelectedChange={(s) => handleSaleUnitsChange(s)}
							>
								<Select.Input name={attrs.name} />
								<Select.Trigger {...attrs}>
									<Select.Value />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="kg" label="κιλό" />
									<Select.Item value="piece" label="τεμάχιο" />
									<Select.Item value="crates" label="τελάρο" />
								</Select.Content>
							</Select.Root>
						</Form.Control>
					</Form.Field>
				</div>
				<Form.Field class="flex w-full max-w-sm flex-col" {form} name="saleUnits">
					<Form.Control let:attrs>
						<Form.Label>Κατηγορία *</Form.Label>
						<Select.Root
							bind:selected={categorySelection}
							onSelectedChange={(s) => handleCategoryChange(s)}
						>
							<Select.Input name={attrs.name} />
							<Select.Trigger {...attrs}>
								<Select.Value />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="fruits" label="Φρούτα" />
								<Select.Item value="vegetables" label="Λαχανικά" />
							</Select.Content>
						</Select.Root>
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="isDisabled" class="items-top mb-6 flex space-x-2">
					<Form.Control let:attrs>
						<Checkbox
							{...attrs}
							bind:checked={$formData.isDisabled}
							class="mt-2 border-input data-[state=checked]:bg-destructive"
							id="is-product-disabled"
						/>
						<Form.Label
							for="is-product-disabled"
							class="text-md flex flex-col gap-1.5 font-medium leading-none text-destructive peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>Το προϊόν δεν είναι διαθέσιμο
							<Form.Description class="text-xs text-muted-foreground">
								Το προϊόν θα εμφανίζεται στους πελάτες αλλά δε θα μπορούν να το προσθέσουν σε
								παραγγελίες τους.
							</Form.Description>
						</Form.Label>
						<input name={attrs.name} value={$formData.isDisabled} hidden />
					</Form.Control>
				</Form.Field>
			</div>
			<Dialog.Footer>
				<Button variant="secondary" type="button" on:click={() => (isDialogOpen = false)}
					>Ακύρωση</Button
				>
				<Button type="submit">Προσθήκη</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
