import { z } from 'zod';

export const productSchema = z.object({
	productId: z.number().optional(),
	productName: z.string().min(1, 'Product name is required'),
	productCode: z.string().min(1, 'Product code is required'),
	categoryId: z.number().default(1),
	saleUnits: z
		.array(z.enum(['kg', 'piece', 'crate', 'bunch', 'cup']))
		.min(1, 'At least one sale unit is required'),
	isDisabled: z.boolean().default(false)
});

export type FormProductSchema = typeof productSchema;
