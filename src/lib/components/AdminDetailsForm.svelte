<script>
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";

    export let email = '';
    export let emailDisabled = false;
</script>

<div class="self-stretch rounded-lg flex-col justify-center items-start flex">
    <div class="self-stretch rounded-lg flex-col justify-center items-start flex gap-4">
        <div class="flex w-full max-w-sm flex-col gap-1.5 ">
            <Label for="email">Email</Label>
            <Input type="email" id="email" placeholder="" bind:value={email} disabled={emailDisabled} />
        </div>
    </div>
</div>