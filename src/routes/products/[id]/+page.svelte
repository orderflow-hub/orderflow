<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Image } from 'lucide-svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { ArrowLeft, Trash, CircleAlert } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import { goto } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import productsStore from '../../../stores/productsStore';
	import { productSchema } from '$lib/schemas/productSchema';
	import type { Selected } from 'bits-ui';
	import { z } from 'zod';

	type ProductSchema = z.infer<typeof productSchema>;
	type Category = ProductSchema['category']; // Product category types
	type SaleUnit = ProductSchema['saleUnits'][number]; // Product saleUnit types

	// Get product data from the server to populate the fields
	export let data;

	let { product } = data;
	if (product === undefined) {
		throw new Error('Product not found');
	}

	if (!data.form) {
		throw new Error('Form data is not provided');
	}

	const form = superForm(data.form, {
		validators: zodClient(productSchema),
		resetForm: false,
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message) {
				if (form.message.status === 'success') {
					toast.success(form.message.text);

					// Updates the Product Store data.
					productsStore.updateProduct(form.message.updatedProduct);

					// Redirect to '/products' page
					goto('/products');
				} else {
					toast.error(form.message.text);
				}
			}
		}
	});

	const { form: formData, enhance } = form;

	// Handle the confirmation dialog for deleting the product
	let isDialogOpen = false;
	function setIsDialogOpen(isOpen: boolean) {
		isDialogOpen = isOpen;
	}

	// Delete the product from the database and show a toast notification. Redirect to '/products' page if successful
	async function handleDelete() {
		const response = await fetch(`/api/products/${product?.product_id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			toast.success('Το προϊόν διαγράφηκε επιτυχώς');
			isDialogOpen = false;

			// Filters deleted product from the store.
			let filteredProducts = $productsStore.filter(
				(product) => product.product_id !== $formData.productId
			);
			productsStore.setProducts(filteredProducts, true);

			// Redirect to '/products' page
			goto('/products');
		} else {
			toast.error('Υπήρξε πρόβλημα κατά τη διαγραφή του προϊόντος');
		}
	}

	function handleSaleUnitsChange(s: Selected<string>[] | undefined) {
		if (s) {
			// Map over selections to extract values
			const selectedValues = s.map((selection) => selection.value as SaleUnit);
			// Update $formData.saleUnits with the new selections
			$formData.saleUnits = selectedValues;
		} else {
			// If no selection, reset $formData.saleUnits to an empty array
			$formData.saleUnits = [];
		}
	}

	function handleCategoryChange(s: Selected<string> | undefined) {
		if (s) {
			$formData.category = s.value as Category;
		}
	}
	const saleUnitLabels: { [key: string]: string } = {
		kg: 'Κιλά',
		piece: 'Τεμάχια',
		crate: 'Τελάρα',
		bunch: 'Ματσάκια',
		cup: 'Κουπάκια'
	};

	// Select items of category
	const categoryLabels: { [key: string]: string } = {
		fruits: 'Φρούτα',
		vegetables: 'Κηπευτικά',
		bundles: 'Δεματικά',
		other: 'Άλλο'
	};

	const saleUnits = Object.entries(saleUnitLabels).map(([value, label]) => ({ value, label }));
	const categories = Object.entries(categoryLabels).map(([value, label]) => ({ value, label }));

	$: defaultSaleUnits = $formData.saleUnits.map((unit) => ({
		value: unit,
		label: saleUnitLabels[unit]
	}));

	$: defaultCategory = {
		value: $formData.category,
		label: categoryLabels[$formData.category]
	};
</script>

<div class="flex flex-col items-stretch justify-center gap-2.5 rounded-lg p-2.5">
	<div class="flex w-full items-center gap-3">
		<a href="/products" class="p-1">
			<ArrowLeft />
		</a>
		<div class="flex shrink grow items-center">
			<h1 class="text-base font-normal text-zinc-700">Επεξεργασία προϊόντος</h1>
		</div>
		<Button variant="ghost" size="icon" on:click={() => setIsDialogOpen(true)}>
			<Trash class="h-5 w-5" />
		</Button>
	</div>
	<div class="flex flex-col items-start justify-center gap-4 rounded-lg">
		<form method="POST" action="?/editProduct" use:enhance>
			<!-- Hidden field for the product ID -->
			<Form.Field {form} name="productId">
				<Form.Control let:attrs>
					<Input {...attrs} bind:value={$formData.productId} type="hidden" />
				</Form.Control>
			</Form.Field>
			<div class="flex flex-col items-start justify-center gap-2.5 self-stretch rounded-lg">
				{#if product?.image_url}
					<div class="h-24 rounded-md border p-2">
						<img
							class="aspect-square h-full object-cover"
							src={product.image_url}
							alt="Εικόνα προϊόντος"
						/>
					</div>
				{:else}
					<Image class="rounded-md border" strokeWidth={1} size={80} />
				{/if}
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
								items={saleUnits}
								bind:selected={defaultSaleUnits}
								multiple={true}
								onSelectedChange={(s) => handleSaleUnitsChange(s)}
							>
								<Select.Input name={attrs.name} />
								<Select.Trigger {...attrs}>
									<Select.Value />
								</Select.Trigger>
								<Select.Content>
									{#each saleUnits as saleUnit}
										<Select.Item value={saleUnit.value} label={saleUnit.label} />
									{/each}
								</Select.Content>
							</Select.Root>
						</Form.Control>
					</Form.Field>
				</div>
				<Form.Field class="mb-3 flex w-full max-w-sm flex-col" {form} name="category">
					<Form.Control let:attrs>
						<Form.Label>Κατηγορία *</Form.Label>
						<Select.Root
							items={categories}
							bind:selected={defaultCategory}
							onSelectedChange={(s) => handleCategoryChange(s)}
						>
							<Select.Input name={attrs.name} />
							<Select.Trigger {...attrs}>
								<Select.Value />
							</Select.Trigger>
							<Select.Content>
								{#each categories as category}
									<Select.Item value={category.value} label={category.label} />
								{/each}
							</Select.Content>
						</Select.Root>
					</Form.Control>
				</Form.Field>
				<Form.Field {form} name="isDisabled" class="items-top mb-3 flex space-x-2">
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
				<Button variant="default" class="w-full text-base font-normal" type="submit"
					>Αποθήκευση</Button
				>
			</div>
		</form>
	</div>
</div>

<!-- Confirmation dialog to prevent the user from accidentally deleting the product -->
<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Trigger />
	<Dialog.Content class="flex flex-col items-start">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2.5 border-b pb-2.5"
				><CircleAlert />Διαγραφή προϊόντος</Dialog.Title
			>
			<Dialog.Description class="text-left">
				Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτό το προϊόν; Αυτή η ενέργεια δεν μπορεί να
				αναιρεθεί.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="secondary" on:click={() => setIsDialogOpen(false)}>Ακύρωση</Button>
			<Button variant="destructive" on:click={handleDelete}>Διαγραφή</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
