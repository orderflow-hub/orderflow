<script>
    import Input from '$lib/components/ui/input/input.svelte';
    import {Search} from 'lucide-svelte';
</script>

<div class="relative flex flex-grow items-center">
    <Input class="pl-10 mr-2.5" placeholder="Αναζήτηση" type="text"/>
    <div class="absolute left-2.5 w-10 p-0 inset-y-0 flex items-center pointer-events-none text-muted-foreground">
      <Search/>
    </div>
</div>