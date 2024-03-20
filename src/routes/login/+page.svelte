<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
	import { authHandlers, authStore } from "../../stores/authStore";

    let email = "";
    let password = "";

    let userRole = "admin"; // TODO: Replace with actual user role when authentication is implemented

    async function handleLogin() {
        authHandlers.login(email, password).then(() => {
            window.location.href = '/';
        }).catch((error) => {
            console.log(error.errorCode, error.errorMessage);
        });
    }
</script>

<div class="flex flex-col max-w-md w-full h-full justify-center items-stretch gap-8 p-2.5">
    <div class="pt-4 text-zinc-700 text-5xl font-extrabold text-center">OrderFlow</div>
    <form class="flex flex-col gap-8" on:submit|preventDefault={handleLogin}>
        <div class="self-stretch rounded-lg flex-col justify-center items-start flex gap-4">
            <div class="flex w-full flex-col gap-1.5 ">
                <Label for="email">Email</Label>
                <Input type="email" id="email" placeholder="" bind:value={email}/>
            </div>
            <div class="flex w-full flex-col gap-1.5 ">
                <Label for="password">Κωδικός</Label>
                <Input type="password" id="password" placeholder="" bind:value={password}/>
            </div>
        </div>
        <div class="flex flex-col justify-center items-stretch">
            <Button type="submit">Σύνδεση</Button>
        </div>
    </form>
</div>