import { writable } from 'svelte/store';
import type { Customer } from '$lib/types';
import type { Readable } from 'svelte/store';
import debounce from 'debounce';

interface CustomersStore extends Readable<Customer[]> {
	hasMore: boolean;
	loading: boolean;
	loadInitialCustomers: (fetch: typeof window.fetch) => void;
	loadMoreCustomers: (fetch: typeof window.fetch) => void;
	searchCustomers: (fetch: typeof window.fetch, searchQuery: string) => void;
}

const createCustomersStore = (): CustomersStore => {
	const { subscribe, set, update } = writable<Customer[]>([]);
	let limit = 10;
	let offset = 0;
	let hasMore = true;
	let loading = false;
	let initialized = false;
	let currentQuery = '';

	const fetchCustomers = async (fetch: typeof window.fetch, reset = false, searchQuery = '') => {
		// Prevent multiple requests at the same time
		if (loading) return;
		loading = true;
		if (reset) {
			set([]);
			offset = 0;
			initialized = false;
		}
		const query = searchQuery.trim();
		const response = await fetch(`/api/customers?limit=${limit}&offset=${offset}&search=${query}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		const newCustomers = await response.json();
		if (newCustomers.length > 0) {
			hasMore = true;
			offset += newCustomers.length;
		} else {
			hasMore = false;
		}
		update((current) => [...current, ...newCustomers]);
		loading = false;
		// console.log('fetchCustomers', newCustomers);
	};

	const debouncedSearch = debounce((query: string) => {
		fetchCustomers(fetch, true, query);
	}, 300);

	return {
		hasMore: hasMore,
		loading: loading,
		subscribe,
		loadInitialCustomers: () => {
			if (!initialized) {
				fetchCustomers(fetch);
				initialized = true;
			}
		},
		loadMoreCustomers: () => {
			if (hasMore) {
				fetchCustomers(fetch, false, currentQuery);
			}
		},
		searchCustomers: (fetch, searchQuery: string) => {
			currentQuery = searchQuery;
			debouncedSearch(searchQuery);
		}
	};
};

const customersStore = createCustomersStore();

export default customersStore;
