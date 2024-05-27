import { writable } from 'svelte/store';
import type { Order } from '$lib/types';
import type { Readable } from 'svelte/store';
import debounce from 'debounce';

interface OrdersStore extends Readable<Order[]> {
	hasMore: boolean;
	loading: boolean;
	loadInitialOrders: (fetch: typeof window.fetch) => void;
	loadMoreOrders: (fetch: typeof window.fetch) => void;
	searchOrders: (fetch: typeof window.fetch, searchQuery: string) => void;
}

const createOrdersStore = (): OrdersStore => {
	const { subscribe, set, update } = writable<Order[]>([]);
	let limit = 10;
	let offset = 0;
	let hasMore = true;
	let loading = false;
	let initialized = false;
	let currentQuery = '';

	const fetchOrders = async (fetch: typeof window.fetch, reset = false, searchQuery = '') => {
		// Prevent multiple requests at the same time
		if (loading) return;
		loading = true;
		if (reset) {
			set([]);
			offset = 0;
			initialized = false;
		}
		const query = searchQuery.trim();
		const response = await fetch(`/api/orders?limit=${limit}&offset=${offset}&search=${query}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		const newOrders = await response.json();
		if (newOrders.length > 0) {
			hasMore = true;
			offset += newOrders.length;
		} else {
			hasMore = false;
		}
		update((current) => [...current, ...newOrders]);
		loading = false;
		// console.log('fetchOrders', newOrders);
	};

	const debouncedSearch = debounce((query: string) => {
		fetchOrders(fetch, true, query);
	}, 300);

	return {
		hasMore: hasMore,
		loading: loading,
		subscribe,
		loadInitialOrders: () => {
			if (!initialized) {
				fetchOrders(fetch);
				initialized = true;
			}
		},
		loadMoreOrders: () => {
			if (hasMore) {
				fetchOrders(fetch, false, currentQuery);
			}
		},
		searchOrders: (fetch, searchQuery: string) => {
			currentQuery = searchQuery;
			debouncedSearch(searchQuery);
		}
	};
};

const ordersStore = createOrdersStore();

export default ordersStore;
