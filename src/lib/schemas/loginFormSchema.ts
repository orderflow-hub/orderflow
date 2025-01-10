import { z } from 'zod';

export const loginFormSchema = z.object({
	email: z.string().superRefine((val, ctx) => {
		if (!val.trim()) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Παρακαλώ εισάγετε τη διεύθυνση email σας'
			});
			return; // Stop further validation if empty
		}
		if (!/\S+@\S+\.\S+/.test(val)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Παρακαλώ εισάγετε έγκυρη διεύθυνση email'
			});
		}
	}),
	password: z.string().min(1, { message: 'Παρακαλώ εισάγετε τον κωδικό πρόσβασης' })
});
