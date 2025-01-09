<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Image, Plus } from 'lucide-svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { productSchema } from '$lib/schemas/productSchema';
	import productsStore from '../../stores/productsStore';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import type { PageData } from './$types';
	import type { Selected } from 'bits-ui';
	import type { Product } from '$lib/types';
	import { z } from 'zod';

	type ProductSchema = z.infer<typeof productSchema>;
	type Category = ProductSchema['category']; // Product category types
	type SaleUnit = ProductSchema['saleUnits'][number]; // Product saleUnit types

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

					productsStore.setProducts([form.message.newProduct], false);

					// Assign the newly created product ID to the formData
					$formData.productId = form.message.newProduct.productId;

					// Upload provided image.
					if (selectedImageFile) {
						uploadImage(selectedImageFile);
					}

					isDialogOpen = false; // Hides form modal.
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

	let selectedImageFile: File | null = null;
	let previewImageUrl: string | null = null;

	function handleImageSelection(event: Event) {
		const fileInput = event.target as HTMLInputElement;
		if (fileInput.files && fileInput.files[0]) {
			selectedImageFile = fileInput.files[0];

			// Generate a temporary preview URL for the selected file
			previewImageUrl = URL.createObjectURL(selectedImageFile);
		}
	}

	async function uploadImage(file: File) {
		const formData = new FormData();
		formData.append('file', file); // Key name matches the server's expectation

		const productId = $formData.productId;

		try {
			const response = await fetch(`/api/products/${productId}/upload-image`, {
				method: 'PATCH',
				body: formData // Use FormData as the body
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to upload image');
			}

			const result = await response.json();
			toast.success('Η φωτογραφία προϊόντος ενημερώθηκε επιτυχώς');

			// Update the store with the new image URL
			productsStore.updateProduct({
				...$formData,
				imageUrl: result.imgUrl
			});
		} catch (error) {
			console.error('Error uploading image:', error);
			toast.error('Άγνωστο σφάλμα. Παρακαλώ προσπαθήστε αργότερα');
		}
	}

	// Select items of saleUnits
	const saleUnits: Selected<string>[] = [
		{ value: 'kg', label: 'Κιλά' },
		{ value: 'piece', label: 'Τεμάχια' },
		{ value: 'crate', label: 'Τελάρα' },
		{ value: 'bunch', label: 'Ματσάκια' },
		{ value: 'cup', label: 'Κουπάκια' }
	];

	// Select items of category
	const categories: Selected<string>[] = [
		{ value: 'fruits', label: 'Φρούτα' },
		{ value: 'vegetables', label: 'Κηπευτικά' },
		{ value: 'bundles', label: 'Δεματικά' },
		{ value: 'other', label: 'Άλλο' }
	];

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
				<div class="h-24 rounded-md border p-2">
					<Label for="imgUpload" class="cursor-pointer">
						{#if previewImageUrl}
							<img
								class="aspect-square h-full object-cover"
								src={previewImageUrl}
								alt="Εικόνα προϊόντος"
							/>
						{:else}
							<Image strokeWidth={1} size={80} />
						{/if}
					</Label>
					<input
						id="imgUpload"
						type="file"
						class="hidden"
						accept="image/*"
						on:change={handleImageSelection}
					/>
				</div>
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
				<Form.Field class="flex w-full max-w-sm flex-col" {form} name="category">
					<Form.Control let:attrs>
						<Form.Label>Κατηγορία *</Form.Label>
						<Select.Root items={categories} onSelectedChange={(s) => handleCategoryChange(s)}>
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
