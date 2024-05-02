<script>
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import CustomerDetailsForm from '$lib/components/CustomerDetailsForm.svelte';
	import AdminDetailsForm from '$lib/components/AdminDetailsForm.svelte';
	import { authHandlers, authStore } from '../../stores/authStore';
	import { EmailAuthProvider } from 'firebase/auth';
	import { toast } from 'svelte-sonner';

	// Get customer data from the server to populate the fields
	export let data;
	let { userRole } = data;

	if (data.customer === undefined) {
		throw new Error('Customer not found');
	}

	let isChangePasswordDialogOpen = false;
	function closeChangePasswordDialog() {
		isChangePasswordDialogOpen = false;
	}

	let oldPassword = '';
	let newPassword = '';
	let newPasswordConfirm = '';

	async function handlePasswordChange() {
		const currentUser = $authStore.currentUser;
		if (newPassword === newPasswordConfirm && currentUser && currentUser.email) {
			const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);

			try {
				await authHandlers.reauthenticateWithCredential(credential);
				await authHandlers.updatePassword(newPassword);
				closeChangePasswordDialog();
				toast.success('Ο κωδικός σας άλλαξε επιτυχώς');
			} catch (error) {
				console.log(error);
			}
		}
	}

	async function handleLogout() {
		try {
			await authHandlers.logout();
			await fetch('/api/logout', { method: 'POST' });
			window.location.href = '/login';
		} catch (error) {
			console.log(error);
		}
	}
</script>

<div class="flex flex-col items-stretch justify-start gap-4 p-4">
	{#if userRole === 'admin'}
		<AdminDetailsForm email={data.customer.email} emailDisabled />
	{:else if userRole === 'customer'}
		<CustomerDetailsForm {data} />
	{/if}
	<Separator />
	<div class="flex flex-col items-stretch gap-2.5">
		<Dialog.Root bind:open={isChangePasswordDialogOpen}>
			<Dialog.Trigger class={`${buttonVariants({ variant: 'secondary' })} text-[16px] font-normal`}
				>Αλλαγή κωδικού</Dialog.Trigger
			>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Αλλαγή κωδικού</Dialog.Title>
				</Dialog.Header>
				<div class="flex flex-col gap-4 pb-6 pt-2.5">
					<div class="flex w-full flex-col gap-1.5">
						<Label for="old-password">Παλιός Κωδικός</Label>
						<Input
							type="password"
							id="old-password"
							placeholder=""
							bind:value={oldPassword}
							required
						/>
					</div>
					<div class="flex w-full flex-col gap-1.5">
						<Label for="new-password">Νέος Κωδικός</Label>
						<Input
							type="password"
							id="new-password"
							placeholder=""
							bind:value={newPassword}
							required
						/>
					</div>
					<div class="flex w-full flex-col gap-1.5">
						<Label for="new-password-confirm">Επανάληψη Νέου Κωδικού</Label>
						<Input
							type="password"
							id="new-password-confirm"
							placeholder=""
							bind:value={newPasswordConfirm}
							required
						/>
					</div>
				</div>
				<Dialog.Footer>
					<Button variant="secondary" on:click={closeChangePasswordDialog}>Ακύρωση</Button>
					<Button type="submit" on:click={handlePasswordChange}>Αλλαγή κωδικού</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
		<Button variant="destructive" class="text-base font-normal" on:click={handleLogout}
			>Αποσύνδεση</Button
		>
	</div>
	<div class="flex justify-center py-4">
		<p class="text-sm font-semibold text-neutral-300">OrderFlow v1.0</p>
	</div>
</div>
