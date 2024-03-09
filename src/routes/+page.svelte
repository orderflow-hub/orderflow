<script>

  import ProductEntry from '$lib/shared/ProductEntry.svelte';
  import OrderEntry from '../lib/shared/OrderEntry.svelte';

</script>

<OrderEntry status="pending"/>
<OrderEntry status="complete"/>
<ProductEntry isAvailable={true}/>
<ProductEntry isAvailable={false}/>

