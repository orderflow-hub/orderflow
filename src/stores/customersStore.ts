import { writable } from 'svelte/store';
import type { Customer } from '$lib/types';
import type { Readable } from 'svelte/store';
import debounce from 'debounce';

interface CustomersStore extends Readable<Customer[]> {
	hasMore: boolean;
	loading: boolean;
	loadInitialCustomers: () => void;
	loadMoreCustomers: () => void;
	searchCustomers: (searchQuery: string) => void;
}

const createCustomersStore = (): CustomersStore => {
	const { subscribe, set, update } = writable<Customer[]>([]);
	let limit = 6;
	let offset = 0;
	let hasMore = true;
	let loading = false;
	let initialized = false;
	let currentQuery = '';

	const fetchCustomers = async (reset = false, searchQuery = '') => {
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
			`http://localhost:5173/api/customers?limit=${limit}&offset=${offset}&search=${query}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);
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
		fetchCustomers(true, query);
	}, 300);

	return {
		hasMore: hasMore,
		loading: loading,
		subscribe,
		loadInitialCustomers: () => {
			if (!initialized) {
				fetchCustomers();
				initialized = true;
			}
		},
		loadMoreCustomers: () => {
			if (hasMore) {
				fetchCustomers(false, currentQuery);
			}
		},
		searchCustomers: (searchQuery: string) => {
			currentQuery = searchQuery;
			debouncedSearch(searchQuery);
		}
	};
};

const customersStore = createCustomersStore();

export default customersStore;
