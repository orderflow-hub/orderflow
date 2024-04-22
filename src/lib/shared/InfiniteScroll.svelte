<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';

	export let hasMore = true;

	const dispatch = createEventDispatcher();

	function checkAndLoadMore() {
		const threshold = 100; // Pixels from the bottom of the page
		const scrollY = window.scrollY;
		const visible = document.documentElement.clientHeight;
		const pageHeight = document.documentElement.scrollHeight;
		const bottomOfPage = visible + scrollY >= pageHeight - threshold;

		if (bottomOfPage) {
			dispatch('loadMore');
		}
	}

	onMount(() => {
		window.addEventListener('scroll', checkPosition);
		return () => {
			window.removeEventListener('scroll', checkPosition);
		};
	});

	function checkPosition() {
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
			if (hasMore) {
				dispatch('loadMore');
			}
		}
	}
</script>

<!-- This component might be invisible, acting only as a trigger -->
<div></div>
