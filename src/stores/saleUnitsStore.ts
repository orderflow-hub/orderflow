import { writable, get } from 'svelte/store';
import type { SaleUnit } from '$lib/types';
import type { Readable } from 'svelte/store';

interface SaleUnitsStore extends Readable<SaleUnit[]> {
	setSaleUnits: (units: SaleUnit[]) => void;
	addSaleUnit: (unit: SaleUnit) => void;
	updateSaleUnit: (saleUnitId: number, label: string) => void;
	removeSaleUnit: (saleUnitId: number) => void;
	getSaleUnitById: (saleUnitId: number) => SaleUnit | undefined;
	clear: () => void;
}

const createSaleUnitsStore = (): SaleUnitsStore => {
	const { subscribe, set, update } = writable<SaleUnit[]>([]);

	return {
		subscribe,
		setSaleUnits: (units) => set(units),
		addSaleUnit: (unit) =>
			update((units) => {
				if (units.find((u) => u.saleUnitId === unit.saleUnitId)) {
					return units;
				}
				return [...units, unit];
			}),
		updateSaleUnit: (saleUnitId, label) =>
			update((units) =>
				units.map((unit) => (unit.saleUnitId === saleUnitId ? { ...unit, label } : unit))
			),
		removeSaleUnit: (saleUnitId) =>
			update((units) => units.filter((unit) => unit.saleUnitId !== saleUnitId)),
		getSaleUnitById: (saleUnitId) => {
			const units = get(saleUnitsStore);
			return units.find((unit) => unit.saleUnitId == saleUnitId);
		},
		clear: () => set([]) // Clear all sale units
	};
};

export const saleUnitsStore = createSaleUnitsStore();
