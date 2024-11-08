import sql from '$lib/db';
import type { Order } from '$lib/types';
import type { RequestHandler } from '@sveltejs/kit';
import { json, redirect } from '@sveltejs/kit';

import escpos from 'escpos';
import Network from 'escpos-network';

// Define constants outside the handler to avoid re-declaring each request
const saleUnitLabels = {
	kg: 'Κιλά',
	piece: 'Τεμάχια',
	crate: 'Τελάρα',
	bunch: 'Ματσάκια',
	cup: 'Κουπάκια'
};

const formatDate = (timestamp: number) =>
	new Date(timestamp)
		.toLocaleString('el-GR', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		})
		.replace(',', ' ∙');

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const userId: string = locals.user.id;

	try {
		const { order }: { order: Order } = await request.json();
		if (!order) {
			return json({ error: 'Order details not provided' }, { status: 400 });
		}

		// Retrieve the user's printer IP
		const response = await sql<{ printer_ip?: string }[]>`
			SELECT printer_ip
			FROM users
			WHERE user_id = ${userId};
		`;

		const printerIP: string | undefined = response[0]?.printer_ip;
		if (!printerIP) {
			return json({ error: 'Printer IP not found' }, { status: 404 });
		}

		// TODO: - Possibly load code page dynamically
		const options = { encoding: 'CP737' };
		const device: Network = new Network(printerIP);
		const printer = new escpos.Printer(device, options);

		// Helper function for printing separators
		const printSeparator = () =>
			printer.size(0.5, 0.5).align('CT').text('------------------------------------------------');

		const printNewLine = () => printer.size(0.5, 0.5).align('CT').newLine();

		device.open(() => {
			try {
				// Print header details
				printer
					.align('CT')
					.style('B')
					.size(1, 1)
					.text(order.company_name)
					.size(1, 1)
					.newLine()
					.align('CT')
					.style('NORMAL')
					.size(0.5, 0.5)
					.text(`ΑΦΜ: ${order.afm}`)
					.text(`ΤΗΛ: ${order.phone_number}`)
					.text(`${order.street_address}, ${order.city}, ${order.postal_code}`)
					.text(formatDate(order.timestamp).toUpperCase());

				// Print new line
				printNewLine();

				// Print separator
				printSeparator();

				// Print table headers
				printer
					.size(0.5, 0.5)
					.align('LT')
					.tableCustom([
						{ text: 'ΠΡΟΪΟΝ', width: 0.35, align: 'LEFT' },
						{ text: 'ΠΟΣΟΤΗΤΑ', width: 0.25, align: 'RIGHT' },
						{ text: 'ΜΟΝΑΔΑ', width: 0.2, align: 'RIGHT' },
						{ text: 'ΖΥΓΙΣΜΑ', width: 0.2, align: 'RIGHT' }
					]);

				// Print separator
				printSeparator();

				// Print each product row
				order.products.forEach((product) => {
					printer
						.size(0.5, 0.5)
						.align('LT')
						.tableCustom([
							{ text: product.product_name.toUpperCase(), align: 'LEFT', width: 0.35 },
							{ text: product.qty.toString(), align: 'RIGHT', width: 0.25 },
							{ text: saleUnitLabels[product.sale_unit].toUpperCase(), align: 'RIGHT', width: 0.2 },
							{ text: '', align: 'RIGHT', width: 0.15 }
						]);
				});

				// Print separator
				printSeparator();

				// Print new line
				printNewLine();

				// Print order message
				printer.align('LT').style('B').size(0.5, 0.5).text('ΕΞΤΕΛΕΣΗ ΠΑΡΑΓΓΕΛΙΑΣ:');
				printer
					.align('LT')
					.style('B')
					.size(0.5, 0.5)
					.text('┌──────────────────────────────────────────────┐');
				printer.text('│                                              │');
				printer.text('└──────────────────────────────────────────────┘');

				// Finish and cut
				printer.size(1, 1).newLine().newLine();
				printer.cut();
				printer.close();
			} catch (printError) {
				console.error('Printing error:', printError);
				throw new Error('Failed to print receipt');
			}
		});

		return json({ success: true });
	} catch (error) {
		console.error('Error processing print request:', error);
		return json({ error: 'Failed to process print request' }, { status: 500 });
	}
};
