<script lang="ts">
    import { page } from '$app/stores';
    import Home from 'lucide-svelte/icons/home';
    import Package from 'lucide-svelte/icons/package';
    import ReceiptText from 'lucide-svelte/icons/receipt-text';
    import Users from 'lucide-svelte/icons/users';
    import User from 'lucide-svelte/icons/user';
    import ShoppingCart from 'lucide-svelte/icons/shopping-cart';

    export let userRole: string | null;
</script>

<nav class="w-full h-12 bg-white border-t border-neutral-200 flex fixed bottom-0">
    {#if userRole === 'admin'}
        <!-- Admin Navbar -->
        <a href="/" class="flex grow justify-center items-center">
            <Home class="{$page.url.pathname === '/' ? 'text-primary' : ''}"/>
        </a>
        <a href="/products" class="flex grow justify-center items-center">
            <Package class="{$page.url.pathname.startsWith('/products') ? 'text-primary' : ''}"/>
        </a>
        <a href="/orders" class="flex grow justify-center items-center">
            <ReceiptText class="{$page.url.pathname.startsWith('/orders') ? 'text-primary' : ''}"/>
        </a>
        <a href="/customers" class="flex grow justify-center items-center">
            <Users class="{$page.url.pathname.startsWith('/customers') ? 'text-primary' : ''}"/>
        </a>
        <a href="/profile" class="flex grow justify-center items-center">
            <User class="{$page.url.pathname.startsWith('/profile') ? 'text-primary' : ''}"/>
        </a>
    {:else if userRole === 'customer'}
        <!-- Customer Navbar -->
        <a href="/orders" class="flex grow justify-center items-center">
            <ReceiptText class="{$page.url.pathname.startsWith('/orders') ? 'text-primary' : ''}"/>
        </a>
        <a href="/products" class="flex grow justify-center items-center">
            <ShoppingCart class="{$page.url.pathname.startsWith('/products') ? 'text-primary' : ''}"/>
        </a>
        <a href="/profile" class="flex grow justify-center items-center">
            <User class="{$page.url.pathname.startsWith('/profile') ? 'text-primary' : ''}"/>
        </a>
    {/if}
</nav>