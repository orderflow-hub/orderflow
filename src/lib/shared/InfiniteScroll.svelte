<script lang="ts">
	import { onMount, createEventDispatcher, onDestroy } from 'svelte';

	export let hasMore = true;
	const dispatch = createEventDispatcher();

	// This function checks if the user has scrolled to near the bottom of the page
	function checkAndLoadMore() {
		// Set a threshold of 100 pixels from the bottom
		const threshold = 100;
		// Calculate the current bottom position of the scroll
		const scrollPosition = window.scrollY + window.innerHeight;
		const bottomPosition = document.body.offsetHeight - threshold;

		if (scrollPosition >= bottomPosition && hasMore) {
			dispatch('loadMore');
		}
	}

	// Throttle function to limit the rate at which 'checkAndLoadMore' can be invoked
	function throttle(func: () => void, limit: number): () => void {
		// This flag controls when the function can be called
		let inThrottle: boolean = false;
		return function (this: any) {
			// Only allow function to be called if throttle is not active
			if (!inThrottle) {
				// Call the passed function
				func.call(this);
				// Activate throttle to prevent further calls
				inThrottle = true;
				// Set a timeout to deactivate the throttle after 'limit' milliseconds
				setTimeout(() => {
					inThrottle = false;
				}, limit);
			}
		};
	}

	// Create a throttled version of the 'checkAndLoadMore' function
	// to prevent it from being called more than once every 200 milliseconds
	const throttledCheckAndLoadMore = throttle(checkAndLoadMore, 200);

	// When the component is first mounted, add event listeners for scroll and resize
	onMount(() => {
		window.addEventListener('scroll', throttledCheckAndLoadMore);
		window.addEventListener('resize', throttledCheckAndLoadMore);
	});

	// Before the component is destroyed, remove the event listeners
	onDestroy(() => {
		window.removeEventListener('scroll', throttledCheckAndLoadMore);
		window.removeEventListener('resize', throttledCheckAndLoadMore);
	});
</script>

<!-- This component might be invisible, acting only as a trigger -->
<div></div>
