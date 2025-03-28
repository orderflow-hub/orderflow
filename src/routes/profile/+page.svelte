<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import CustomerDetailsForm from '$lib/components/CustomerDetailsForm.svelte';
	import AdminDetailsForm from '$lib/components/AdminDetailsForm.svelte';
	import { authHandlers, authStore } from '../../stores/authStore';
	import { EmailAuthProvider } from 'firebase/auth';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';
	import type { Customer } from '$lib/types';

	export let data: PageData;
	const { userRole } = data;
	const customer: Customer = data.customer; // Get customer data from the server to populate the fields
	const { customerDetailsForm } = data;

	if (!customer) {
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
			await fetch('/api/sessionLogout', { method: 'POST' });
			window.location.href = '/login';
		} catch (error) {
			console.log(error);
		}
	}
</script>

<div class="flex flex-col items-stretch justify-start gap-4 p-4">
	<Card.Root class="border-none">
		<Card.Header class="overflow-hidden rounded-t-md border-b p-0">
			<Card.Title class="flex h-10 items-center justify-center bg-secondary font-normal">
				Στοιχεία Χρήστη
			</Card.Title>
		</Card.Header>
		<Card.Content class="mt-2.5 p-0">
			{#if userRole === 'admin'}
				<AdminDetailsForm email={customer.email} emailDisabled />
			{:else if userRole === 'customer'}
				<CustomerDetailsForm {customerDetailsForm} />
			{/if}
		</Card.Content>
	</Card.Root>
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
