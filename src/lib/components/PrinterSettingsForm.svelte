<script lang="ts">
	import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import {
		formPrinterSettingsSchema,
		type FormPrinterSettingsSchema
	} from '$lib/schemas/printerSettingsSchema';

	export let printerSettingsForm: SuperValidated<Infer<FormPrinterSettingsSchema>>;

	if (!printerSettingsForm) {
		throw new Error('Form error');
	}

	const form = superForm(printerSettingsForm, {
		validators: zodClient(formPrinterSettingsSchema),
		resetForm: false,
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message) {
				if (form.message.status === 'success') {
					toast.success(form.message.text);
				} else {
					toast.error(form.message.text);
				}
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/savePrinterSettings" use:enhance>
	<div class="mt-2 flex w-full max-w-sm flex-col gap-1.5">
		<Form.Field {form} name="printerIp">
			<Form.Control let:attrs>
				<Form.Label>Διεύθυνση IP</Form.Label>
				<Input {...attrs} bind:value={$formData.printerIp} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Button type="submit" class="w-full">Αποθήκευση</Button>
	</div>
</form>
