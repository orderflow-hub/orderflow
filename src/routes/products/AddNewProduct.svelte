<script lang="ts">
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

	// export let data: SuperValidated<Infer<FormProductSchema>>;
	export let data;

	const form = superForm(data, {
		validators: zodClient(productSchema)
	});

	const { form: formData, enhance } = form;

	$: selectedSaleUnit = $formData.saleUnit
		? {
				label: $formData.saleUnit === 'kg' ? 'κιλό' : 'τεμάχιο',
				value: $formData.saleUnit === 'kg' ? 'kg' : 'piece'
			}
		: undefined;
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
				<div class="mb-3 flex w-full gap-3">
					<Form.Field class="flex w-full max-w-sm flex-col" {form} name="productCode">
						<Form.Control let:attrs>
							<Form.Label>Κωδικός προϊόντος *</Form.Label>
							<Input {...attrs} bind:value={$formData.productCode} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field class="flex w-full max-w-sm flex-col" {form} name="saleUnit">
						<Form.Control let:attrs>
							<Form.Label>Μονάδα μέτρησης *</Form.Label>
							<Select.Root
								bind:selected={selectedSaleUnit}
								onSelectedChange={(s) => {
									s && ($formData.saleUnit = s.value);
								}}
							>
								<Select.Input name={attrs.name} />
								<Select.Trigger {...attrs}>
									<Select.Value />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="kg" label="κιλό" />
									<Select.Item value="piece" label="τεμάχιο" />
								</Select.Content>
							</Select.Root>
						</Form.Control>
					</Form.Field>
				</div>
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
							class="text-md flex flex-col gap-1.5 font-medium leading-none leading-none text-destructive peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
