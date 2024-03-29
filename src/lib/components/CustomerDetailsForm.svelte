<script>
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	export let companyName = '';
	export let companyNameDisabled = false;
	export let customerId = '';
	export let customerIdDisabled = false;
	export let email = '';
	export let emailDisabled = false;
	export let phone = '';
	export let phoneDisabled = false;
	export let afm = '';
	export let afmDisabled = false;
	export let address = '';
	export let addressDisabled = false;
	export let city = '';
	export let cityDisabled = false;
	export let postalCode = '';
	export let postalCodeDisabled = false;
</script>

<div class="flex flex-col items-start justify-center self-stretch rounded-lg">
	<div class="flex flex-col items-start justify-center gap-4 self-stretch rounded-lg">
		<div class="flex w-full max-w-sm flex-col gap-1.5">
			<Label for="company-name">Επωνυμία</Label>
			<Input
				type="text"
				id="company-name"
				placeholder=""
				bind:value={companyName}
				disabled={companyNameDisabled}
			/>
		</div>
		<div class="flex w-full max-w-sm flex-col gap-1.5">
			<Label for="customer-id">Κωδικός πελάτη</Label>
			<Input
				type="text"
				id="customer-id"
				placeholder=""
				bind:value={customerId}
				disabled={customerIdDisabled}
			/>
		</div>
		<div class="flex w-full max-w-sm flex-col gap-1.5">
			<Label for="email">Email</Label>
			<Input type="email" id="email" placeholder="" bind:value={email} disabled={emailDisabled} />
		</div>
		<div class="flex gap-3">
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="phone">Τηλέφωνο</Label>
				<Input type="text" id="phone" placeholder="" bind:value={phone} disabled={phoneDisabled} />
			</div>
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<Label for="afm">ΑΦΜ</Label>
				<Input type="text" id="afm" placeholder="" bind:value={afm} disabled={afmDisabled} />
			</div>
		</div>
		<div class="flex w-full max-w-sm flex-col gap-1.5">
			<Label for="address">Διεύθυνση</Label>
			<Input
				type="text"
				id="address"
				placeholder=""
				bind:value={address}
				disabled={addressDisabled}
			/>
		</div>
		<div class="flex gap-3">
			<div class="flex max-w-sm basis-2/3 flex-col gap-1.5">
				<Label for="city">Πόλη</Label>
				<Input type="text" id="city" placeholder="" bind:value={city} disabled={cityDisabled} />
			</div>
			<div class="flex max-w-sm basis-1/3 flex-col gap-1.5">
				<Label for="postal-code">Τ.Κ.</Label>
				<Input
					type="number"
					id="postal-code"
					placeholder=""
					bind:value={postalCode}
					disabled={postalCodeDisabled}
				/>
			</div>
		</div>
	</div>
</div>
