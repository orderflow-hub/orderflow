import { z } from 'zod';

export const customerSchema = z.object({
	companyName: z.string().min(1, 'Company name is required'),
	userCode: z.string().min(1, 'Product code is required'),
	email: z.string().email('Invalid email address'),
	afm: z.string().superRefine((value, ctx) => {
		// First, check if the length is exactly 9 digits
		if (value.length !== 9) {
			ctx.addIssue({
				code: 'custom',
				message: 'AFM must be 9 digits'
			});
		} else if (!/^[0-9]+$/.test(value)) {
			// Then check if it is numeric
			ctx.addIssue({
				code: 'custom',
				message: 'AFM must be a number'
			});
		}
	}),
	phoneNumber: z.string().superRefine((value, ctx) => {
		// First, check if the length is less than 10 digits
		if (value.length < 10) {
			ctx.addIssue({
				code: 'too_small',
				minimum: 10,
				type: 'string',
				inclusive: true,
				message: 'Phone number must be at least 10 digits'
			});
		} else if (!/^[0-9]+$/.test(value)) {
			// Then check if it is numeric
			ctx.addIssue({
				code: 'custom',
				message: 'Phone number must be a number'
			});
		}
	}),
	streetAddress: z.string().optional(),
	city: z.string().max(20, 'City name must be less than 20 characters').optional(),
	postalcode: z
		.string()
		.optional()
		.refine((data) => data === undefined || data.length === 5, {
			message: 'Postal code must be exactly 5 characters long if provided'
		})
});

export type FormCustomerSchema = typeof customerSchema;
