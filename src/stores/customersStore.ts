import { writable } from 'svelte/store';
import type { Customer } from '$lib/types';
import type { Readable } from 'svelte/store';
import debounce from 'debounce';

interface CustomersStore extends Readable<Customer[]> {
	hasMore: boolean;
	loading: boolean;
	setCustomers: (orders: Customer[], reset: boolean) => void;
	setLoading: (isLoading: boolean) => void;
	setHasMore: (hasMore: boolean) => void;
	updateCustomer: (updatedCustomer: Customer) => void;
	reset: () => void;
}

const createCustomersStore = (): CustomersStore => {
	const { subscribe, set, update } = writable<Customer[]>([]);
	let hasMore = true;
	let loading = false;

	return {
		hasMore,
		loading,
		subscribe,
		setCustomers(customers: Customer[], reset: boolean) {
			if (reset) {
				set(customers);
			} else {
				update((current) => [...customers, ...current]);
			}
		},
		setLoading: (isLoading: boolean) => {
			loading = isLoading;
		},
		setHasMore: (more: boolean) => {
			hasMore = more;
		},
		updateCustomer: (updatedCustomer: Customer) => {
			update((current) =>
				current.map((customer) =>
					customer.user_id === updatedCustomer.user_id
						? updatedCustomer
						: customer
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

const customersStore = createCustomersStore();

export default customersStore;
