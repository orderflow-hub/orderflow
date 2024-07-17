import { z } from 'zod';

export const productSchema = z.object({
	productId: z.number().optional(),
	productName: z.string().min(1, 'Υποχρεωτικό πεδίο'),
	productCode: z.string().min(1, 'Υποχρεωτικό πεδίο'),
	saleUnit: z.enum(['kg', 'piece']),
	isDisabled: z.boolean().default(false)
});

export type FormProductSchema = typeof productSchema;
