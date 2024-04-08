<script>
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Image } from 'lucide-svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';

	export let object = {
		customer_company_name: '',
		customer_code: '',
		email: '',
		phone: '',
		afm: '',
		active: true
	};
</script>

<form class="flex flex-col items-start justify-center self-stretch rounded-lg" autocomplete="off">
	<div class="flex flex-col items-start justify-center gap-4 self-stretch rounded-lg">
		<div class="flex w-full max-w-sm flex-col gap-1.5">
			<Label for="customer-company-name">Επωνυμία</Label>
			<Input
				type="text"
				id="customer-company-name"
				placeholder=""
				bind:value={object.customer_company_name}
			/>
		</div>
		<div class="flex w-full max-w-sm flex-col gap-1.5">
			<Label for="customer-code">Κωδικός πελάτη</Label>
			<Input type="text" id="customer-code" placeholder="" bind:value={object.customer_code} />
		</div>
		<div class="flex w-full max-w-sm flex-col gap-1.5">
			<Label for="email">Email</Label>
			<Input type="email" id="email" placeholder="" bind:value={object.email} />
		</div>
		<div class="mb-3 flex gap-3">
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="phone">Τηλέφωνο</Label>
				<Input type="tel" id="phone" placeholder="" bind:value={object.phone} />
			</div>
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="afm">ΑΦΜ</Label>
				<Input
					type="number"
					id="afm"
					placeholder=""
					bind:value={object.afm}
					autocomplete="new-password"
				/>
			</div>
		</div>
	</div>
</form>
