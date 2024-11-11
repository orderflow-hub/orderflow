import { z } from 'zod';

export const formPrinterSettingsSchema = z.object({
	printerIp: z
		.string()
		.nullable()
		.optional()
		.refine(
			(ip) => {
				// Allow null or empty string, otherwise ensure it’s a valid IPv4 address
				return (
					!ip ||
					(/^(\d{1,3}\.){3}\d{1,3}$/.test(ip) &&
						ip.split('.').every((num) => parseInt(num, 10) >= 0 && parseInt(num, 10) <= 255))
				);
			},
			{
				message: 'Printer IP must be a valid IPv4 address'
			}
		)
});

export type FormPrinterSettingsSchema = typeof formPrinterSettingsSchema;
