import { writable } from 'svelte/store';
import type { Order } from '$lib/types';
import type { Readable } from 'svelte/store';
import debounce from 'debounce';

interface OrdersStore extends Readable<Order[]> {
	hasMore: boolean;
	loading: boolean;
	resetOrders: () => void;
	loadInitialOrders: () => void;
	loadMoreOrders: () => void;
	searchOrders: (searchQuery: string) => void;
}

const createOrdersStore = (): OrdersStore => {
	const { subscribe, set, update } = writable<Order[]>([]);
	let limit = 6;
	let offset = 0;
	let hasMore = true;
	let loading = false;
	let initialized = false;
	let currentQuery = '';

	const fetchOrders = async (reset = false, searchQuery = '') => {
		// Prevent multiple requests at the same time
		if (loading) return;
		loading = true;
		if (reset) {
			set([]);
			offset = 0;
			initialized = false;
		}
		const query = searchQuery.trim();
		const response = await fetch(
			`http://localhost:5173/api/orders?limit=${limit}&offset=${offset}&search=${query}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);
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
		fetchOrders(true, query);
	}, 300);

	return {
		hasMore: hasMore,
		loading: loading,
		subscribe,
		loadInitialOrders: () => {
			if (!initialized) {
				fetchOrders();
				initialized = true;
			}
		},
		loadMoreOrders: () => {
			if (hasMore) {
				fetchOrders(false, currentQuery);
			}
		},
		searchOrders: (searchQuery: string) => {
			currentQuery = searchQuery;
			debouncedSearch(searchQuery);
		},
		resetOrders: () => {
			set([]);
		}
	};
};

const ordersStore = createOrdersStore();

export default ordersStore;
