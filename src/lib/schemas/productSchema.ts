import { z } from 'zod';

export const productSchema = z.object({
	productId: z.number().optional(),
	productName: z.string().min(1, 'Product name is required'),
	productCode: z.string().min(1, 'Product code is required'),
	saleUnit: z.enum(['kg', 'piece']),
	isDisabled: z.boolean().default(false)
});

export type FormProductSchema = typeof productSchema;
