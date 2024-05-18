import { writable } from 'svelte/store';
import type { Product } from '$lib/types';
import type { Readable } from 'svelte/store';
import debounce from 'debounce';

interface ProductsStore extends Readable<Product[]> {
	hasMore: boolean;
	loading: boolean;
	resetProducts: () => void;
	loadInitialProducts: () => void;
	loadMoreProducts: () => void;
	searchProducts: (searchQuery: string) => void;
}

const createProductsStore = (): ProductsStore => {
	const { subscribe, set, update } = writable<Product[]>([]);
	let limit = 10;
	let offset = 0;
	let hasMore = true;
	let loading = false;
	let initialized = false;
	let currentQuery = '';

	const fetchProducts = async (reset = false, searchQuery = '') => {
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
			`http://localhost:5173/api/products?limit=${limit}&offset=${offset}&search=${query}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			}
		);
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

	const debouncedSearch = debounce((query: string) => {
		fetchProducts(true, query);
	}, 300);

	return {
		hasMore: hasMore,
		loading: loading,
		subscribe,
		loadInitialProducts: () => {
			if (!initialized) {
				fetchProducts();
				initialized = true;
			}
		},
		loadMoreProducts: () => {
			if (hasMore) {
				fetchProducts(false, currentQuery);
			}
		},
		searchProducts: (searchQuery: string) => {
			currentQuery = searchQuery;
			debouncedSearch(searchQuery);
		},
		resetProducts: () => {
			set([]);
		}
	};
};

const productsStore = createProductsStore();

export default productsStore;
