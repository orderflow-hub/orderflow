<script lang="ts">
	import type { fromCamel } from 'postgres';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Image, Plus } from 'lucide-svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
	import { productSchema, type FormProductSchema } from '$lib/schemas/productSchema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';

	export let data: SuperValidated<Infer<FormProductSchema>>;

	const form = superForm(data, {
		validators: zodClient(productSchema)
	});

	const { form: formData, enhance } = form;

	$: selectedSaleUnit = $formData.saleUnit
		? {
				label: $formData.saleUnit,
				value: $formData.saleUnit
			}
		: undefined;

	// async function handleSubmit() {
	// const productData = { productName, productCode, saleUnit, isDisabled };
	// Perform validation here if needed before sending the request
	// console.log(productData);
	// try {
	// 	const response = await fetch('/api/products', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(productData)
	// 	});
	// 	if (!response.ok) {
	// 		throw new Error('Failed to create product');
	// 	}
	// 	// Assuming the form is within a dialog and should be closed upon successful submission
	// 	isDialogOpen = false; // Make sure `isDialogOpen` is a writable store or passed as a prop if it's managed outside
	// 	toast.success('Product added successfully');
	// } catch (error) {
	// 	toast.error((error as Error).message);
	// }
	// }
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
		<form method="POST" use:enhance>
			<div class="flex flex-col items-start justify-center self-stretch rounded-lg">
				<div class="mb-3 flex flex-col items-start justify-center gap-4 self-stretch rounded-lg">
					<Image class="rounded-md border" strokeWidth={1} size={80} />

					<Form.Field class="flex w-full max-w-sm flex-col gap-1.5" {form} name="productName">
						<Form.Control let:attrs>
							<Form.Label>Όνομα προϊόντος</Form.Label>
							<Input {...attrs} bind:value={$formData.productName} />
						</Form.Control>
					</Form.Field>
					<div class="mb-3 flex gap-3">
						<Form.Field class="flex w-full max-w-sm flex-col gap-1.5" {form} name="productCode">
							<Form.Control let:attrs>
								<Form.Label>Κωδικός προϊόντος</Form.Label>
								<Input {...attrs} bind:value={$formData.productCode} />
							</Form.Control>
						</Form.Field>

						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Form.Field {form} name="saleUnit">
								<Form.Control let:attrs>
									<Form.Label>Μονάδα μέτρησης</Form.Label>
									<Select.Root
										bind:selected={selectedSaleUnit}
										on:selectedChange={({ detail }) => {
											$formData.saleUnit = detail.value;
										}}
									>
										<Select.Trigger {...attrs}>
											<Select.Value placeholder="Κιλό/Τεμ" />
										</Select.Trigger>
										<Select.Content>
											<Select.Item value="kg" label="kg" />
											<Select.Item value="piece" label="τεμάχιο" />
										</Select.Content>
									</Select.Root>
									<input hidden bind:value={$formData.saleUnit} name={attrs.name} />
								</Form.Control>
							</Form.Field>
						</div>
					</div>
					<div class="items-top mb-3 flex space-x-2">
						<Checkbox
							id="isAvailable"
							bind:checked={$formData.isAvailable}
							class="border-input data-[state=checked]:bg-destructive"
						/>
						<Label
							for="isAvailable"
							class="text-md flex flex-col gap-1.5 font-medium leading-none text-destructive peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							<span>Το προϊόν δεν είναι διαθέσιμο</span>
							<p class="text-xs text-muted-foreground">
								Το προϊόν θα εμφανίζεται στους πελάτες αλλά δε θα μπορούν να το προσθέσουν σε
								παραγγελίες τους.
							</p>
						</Label>
					</div>

					<!-- <div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="product-name">Όνομα προϊόντος</Label>
						<Input type="text" id="product-name" placeholder="" bind:value={productName} required />
					</div>
					<div class="mb-3 flex gap-3">
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="productCode">Κωδικός προϊόντος</Label>
							<Input
								type="text"
								id="productCode"
								placeholder=""
								bind:value={productCode}
								required
							/>
						</div>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="saleUnit">Μονάδα μέτρησης</Label>
							<Select.Root required selected={{ value: 'kg', label: 'kg' }}>
								<Select.Trigger>
									<Select.Value placeholder="Κιλό/Τεμ" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="kg">kg</Select.Item>
									<Select.Item value="piece">τεμάχιο</Select.Item>
								</Select.Content>
								<Select.Input name="saleUnit" />
							</Select.Root>
						</div>
					</div>
					<div class="items-top mb-3 flex space-x-2">
						<Checkbox
							id="isAvailable"
							bind:checked={isDisabled}
							class="border-input data-[state=checked]:bg-destructive"
						/>
						<Label
							for="isAvailable"
							class="text-md flex flex-col gap-1.5 font-medium leading-none text-destructive peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							<span>Το προϊόν δεν είναι διαθέσιμο</span>
							<p class="text-xs text-muted-foreground">
								Το προϊόν θα εμφανίζεται στους πελάτες αλλά δε θα μπορούν να το προσθέσουν σε
								παραγγελίες τους.
							</p>
						</Label>
					</div> -->
				</div>
			</div>
			<Dialog.Footer>
				<Button variant="secondary" type="button" on:click={() => (isDialogOpen = false)}>
					Ακύρωση
				</Button>
				<Button type="submit">Προσθήκη</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- <div class="flex flex-col items-start justify-center self-stretch rounded-lg">
	<div class="flex flex-col items-start justify-center gap-4 self-stretch rounded-lg">
		<Image class="rounded-md border" strokeWidth={1} size={80} />
		<div class="flex w-full max-w-sm flex-col gap-1.5">
			<Label for="product-name">Όνομα προϊόντος</Label>
			<Input type="text" id="product-name" placeholder="" bind:value={productName} required />
		</div>
		<div class="mb-3 flex gap-3">
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="productCode">Κωδικός προϊόντος</Label>
				<Input type="text" id="productCode" placeholder="" bind:value={productCode} required />
			</div>
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="saleUnit">Μονάδα μέτρησης</Label>
				<Select.Root required selected={{ value: 'kg', label: 'kg' }}>
					<Select.Trigger>
						<Select.Value placeholder="Κιλό/Τεμ" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="kg">kg</Select.Item>
						<Select.Item value="piece">τεμάχιο</Select.Item>
					</Select.Content>
					<Select.Input name="saleUnit" />
				</Select.Root>
			</div>
		</div>
		<div class="items-top mb-3 flex space-x-2">
			<Checkbox id="isAvailable" class="border-input data-[state=checked]:bg-destructive" />
			<Label
				for="isAvailable"
				class="text-md flex flex-col gap-1.5 font-medium leading-none text-destructive peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				<span>Το προϊόν δεν είναι διαθέσιμο</span>
				<p class="text-xs text-muted-foreground">
					Το προϊόν θα εμφανίζεται στους πελάτες αλλά δε θα μπορούν να το προσθέσουν σε παραγγελίες
					τους.
				</p>
			</Label>
		</div>
	</div>
</div> -->
