import { z } from 'zod';

export const customerSchema = z.object({
	companyName: z.string().min(1, 'Company name is required'),
	userCode: z.string().min(1, 'Product code is required'),
	email: z.string().email('Invalid email address'),
	afm: z
		.string()
		.min(9, 'AFM must be 9 digits')
		.max(9, 'AFM must be 9 digits')
		.length(9, 'AFM must be 9 digits')
		.regex(/^[0-9]+$/, 'AFM must be a number'),
	phoneNumber: z
		.string()
		.min(10, 'Phone number must be at least 10 digits')
		.regex(/^[0-9]+$/, 'Phone number must be a number'),
	streetAddress: z.string().default(''),
	city: z.string().default(''),
	postalCode: z.string().default('')
});

export type FormCustomerSchema = typeof customerSchema;
