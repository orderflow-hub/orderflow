import { z } from 'zod';

export const loginFormSchema = z.object({
	email: z
		.string({ required_error: 'Η διεύθυνση email είναι απαραίτητη' })
		.min(1, { message: 'Η διεύθυνση email είναι απαραίτητη' })
		.email({ message: 'Το πεδίο πρέπει να είναι διεύθυνση email' }),
	password: z
		.string({ required_error: 'Ο κωδικός πρόσβασης είναι απαραίτητος' })
		.min(1, { message: 'Ο κωδικός είναι απαραίτητος' })
});
