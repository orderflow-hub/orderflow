import { writable, derived, get } from 'svelte/store';
import type { Readable } from 'svelte/store';
import type { Product } from '$lib/types';

interface CartStore extends Readable {
	addItem: (item: Product) => void;
	updateItemQuantity: (id: number, qty: number) => void;
	getItemQuantity: (id: number) => number;
	updateItemSaleUnit: (id: number, sale_unit: string) => void;
	removeItem: (id: number) => void;
	clear: () => void;
}

const createCartStore = (): CartStore => {
	const { subscribe, set, update } = writable<Product[]>([]);

	return {
		subscribe,
		addItem: (item) =>
			update((items) => {
				// Check if the item is already in the cart
				const index = items.findIndex((i) => i.product_id === item.product_id);
				if (index === -1) {
					// Item not in cart, add it with qty 1 if not provided
					return [...items, { ...item, qty: item.qty || 1 }];
				}
				// If the item is already in the cart, return the current state without changes
				return items;
			}),
		updateItemQuantity: (id, qty) =>
			// Set the quantity of the item with the given id
			update((items) => items.map((item) => (item.product_id === id ? { ...item, qty } : item))),
		updateItemSaleUnit: (id, sale_unit) => {
			update((items) =>
				items.map((item) =>
					item.product_id === id ? { ...item, selected_sale_unit: sale_unit } : item
				)
			);
		},
		getItemQuantity: (id) => {
			const items = get({ subscribe }); // Use get to access the current state
			const item = items.find((item) => item.product_id === id);
			return item ? item.qty : 0;
		},
		removeItem: (id) => update((items) => items.filter((item) => item.product_id !== id)),
		clear: () => set([]) // Clear the cart
	};
};

export const cart = createCartStore();

// Create a derived store to count the number of items in the cart
export const itemCount = derived(cart, ($cart) => $cart.length);
