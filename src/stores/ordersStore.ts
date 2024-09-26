import { writable } from 'svelte/store';
import type { Order } from '$lib/types';
import type { Readable } from 'svelte/store';
import debounce from 'debounce';

interface OrdersStore extends Readable<Order[]> {
	hasMore: boolean;
	loading: boolean;
	setOrders: (orders: Order[], reset: boolean) => void;
	setLoading: (isLoading: boolean) => void;
	setHasMore: (hasMore: boolean) => void;
	reset: () => void;
}

const createOrdersStore = (): OrdersStore => {
	const { subscribe, set, update } = writable<Order[]>([]);
	let hasMore = true;
	let loading = false;

	return {
		hasMore,
		loading,
		subscribe,
		setOrders: (orders: Order[], reset: boolean) => {
			if (reset) {
				set(orders);
			} else {
				update((current) => [...orders, ...current]);
			}
		},
		setLoading: (isLoading: boolean) => {
			loading = isLoading;
		},
		setHasMore: (more: boolean) => {
			hasMore = more;
		},
		reset: () => {
			set([]);
			hasMore = true;
			loading = false;
		}
	};
};

const ordersStore = createOrdersStore();

export default ordersStore;
