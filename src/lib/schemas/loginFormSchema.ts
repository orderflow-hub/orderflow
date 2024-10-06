import { z } from 'zod';

export const loginFormSchema = z.object({
	email: z
		.string({ required_error: 'Παρακαλώ εισάγετε τη διεύθυνση email σας' })
		.min(1, { message: 'Παρακαλώ εισάγετε τη διεύθυνση email σας' })
		.email({ message: 'Παρακαλώ εισάγετε έγκυρη διεύθυνση email' }),
	password: z
		.string({ required_error: 'Παρακαλώ εισάγετε τον κωδικό πρόσβασης' })
		.min(1, { message: 'Παρακαλώ εισάγετε τον κωδικό πρόσβασης' })
});
