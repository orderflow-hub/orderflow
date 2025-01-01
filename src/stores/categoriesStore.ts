import { writable, get } from 'svelte/store';
import type { Category } from '$lib/types';
import type { Readable } from 'svelte/store';

interface CategoriesStore extends Readable<Category[]> {
	setCategories: (categories: Category[]) => void;
	addCategory: (category: Category) => void;
	updateCategory: (categoryId: number, label: string) => void;
	removeCategory: (categoryId: number) => void;
	getCategoryById: (categoryId: number) => Category | undefined;
	clear: () => void;
}

const createCategoriesStore = (): CategoriesStore => {
	const { subscribe, set, update } = writable<Category[]>([]);
	return {
		subscribe,
		setCategories: (categories) => set(categories),
		addCategory: (category) =>
			update((categories) => {
				if (categories.find((c) => c.categoryId === category.categoryId)) {
					return categories;
				}
				return [...categories, category];
			}),
		updateCategory: (categoryId, label) =>
			update((categories) =>
				categories.map((category) =>
					category.categoryId === categoryId ? { ...category, label } : category
				)
			),
		removeCategory: (categoryId) =>
			update((categories) => categories.filter((category) => category.categoryId !== categoryId)),
		getCategoryById: (categoryId) => {
			const units = get(categoriesStore);
			return units.find((unit) => unit.categoryId == categoryId);
		},
		clear: () => set([]) // Clear all sale units
	};
};

export const categoriesStore = createCategoriesStore();
