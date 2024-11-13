<script>
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';

	export let email = '';
	export let emailDisabled = false;
</script>

<div class="mt-2 flex w-full max-w-sm flex-col gap-1.5">
	<Label for="email">Email</Label>
	<Input type="email" id="email" placeholder="" bind:value={email} disabled={emailDisabled} />
</div>
