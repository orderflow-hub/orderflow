import { writable } from 'svelte/store';
import type { Product } from '$lib/types';
import type { Readable } from 'svelte/store';
import debounce from 'debounce';

interface ProductsStore extends Readable<Product[]> {
	hasMore: boolean;
	loading: boolean;
	loadInitialProducts: (fetch: typeof window.fetch) => void;
	loadMoreProducts: (fetch: typeof window.fetch) => void;
	searchProducts: (fetch: typeof window.fetch, searchQuery: string) => void;
}

const createProductsStore = (): ProductsStore => {
	const { subscribe, set, update } = writable<Product[]>([]);
	let limit = 10;
	let offset = 0;
	let hasMore = true;
	let loading = false;
	let initialized = false;
	let currentQuery = '';

	const fetchProducts = async (fetch: typeof window.fetch, reset = false, searchQuery = '') => {
		// Prevent multiple requests at the same time
		if (loading) return;
		loading = true;
		if (reset) {
			set([]);
			offset = 0;
			initialized = false;
		}
		const query = searchQuery.trim();
		const response = await fetch(`/api/products?limit=${limit}&offset=${offset}&search=${query}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
		const newProducts = await response.json();
		if (newProducts.length > 0) {
			hasMore = true;
			offset += newProducts.length;
		} else {
			hasMore = false;
		}
		update((current) => [...current, ...newProducts]);
		loading = false;
		// console.log('fetchProducts', newProducts);
	};

	const debouncedSearch = debounce((fetch: typeof window.fetch, query: string) => {
		fetchProducts(fetch, true, query);
	}, 300);

	return {
		hasMore: hasMore,
		loading: loading,
		subscribe,
		loadInitialProducts: (fetch) => {
			if (!initialized) {
				fetchProducts(fetch);
				initialized = true;
			}
		},
		loadMoreProducts: (fetch) => {
			if (hasMore) {
				fetchProducts(fetch, false, currentQuery);
			}
		},
		searchProducts: (fetch, searchQuery: string) => {
			currentQuery = searchQuery;
			debouncedSearch(fetch, searchQuery);
		}
	};
};

const productsStore = createProductsStore();

export default productsStore;
