import { writable } from 'svelte/store';
import type { Product } from '$lib/types';
import type { Readable } from 'svelte/store';

interface ProductsStore extends Readable<Product[]> {
	hasMore: boolean;
	loading: boolean;
	setProducts: (products: Product[], reset: boolean) => void;
	setLoading: (isLoading: boolean) => void;
	setHasMore: (hasMore: boolean) => void;
	updateProduct: (updatedProduct: Product) => void;
	reset: () => void;
}

const createProductsStore = (): ProductsStore => {
	const { subscribe, set, update } = writable<Product[]>([]);
	let hasMore = true;
	let loading = false;

	return {
		hasMore,
		loading,
		subscribe,
		setProducts: (products: Product[], reset: boolean) => {
			if (reset) {
				set(products);
			} else {
				update((current) => [...products, ...current]);
			}
		},
		setLoading: (isLoading: boolean) => {
			loading = isLoading;
		},
		setHasMore: (more: boolean) => {
			hasMore = more;
		},
		updateProduct: (updatedProduct: Product) => {
			update((current) =>
				current.map((product) =>
					product.product_id === updatedProduct.product_id ? updatedProduct : product
				)
			);
		},
		reset: () => {
			set([]);
			hasMore = true;
			loading = false;
		}
	};
};

const productsStore = createProductsStore();

export default productsStore;
