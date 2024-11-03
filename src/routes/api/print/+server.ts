// API Endpoint: /api/print

import sql from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
const escpos = require('escpos');
escpos.Network = require('escpos-network');

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Parse the JSON body to get order details and printer settings
		const { order, printerIP } = await request.json();

		if (!order || !printerIP) {
			return json({ error: 'Order details or printer IP not provided' }, { status: 400 });
		}

		const device = new escpos.Network(printerIP); // Connect to printer via IP
		const printer = new escpos.Printer(device);

		const formattedDateTime = new Date(order.timestamp)
			.toLocaleString('el-GR', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			})
			.replace(',', ' •');

		const saleUnitLabels: { [key: string]: string } = {
			kg: 'Κιλά',
			piece: 'Τεμάχια',
			crate: 'Τελάρα',
			bunch: 'Ματσάκια',
			cup: 'Κουπάκια'
		};

		device.open((error) => {
			if (error) {
				console.error('Failed to connect to the printer:', error);
				return json({ error: 'Failed to connect to the printer' }, { status: 500 });
			}

			// Start printing the order details using the style you provided
			printer
				.font('a')
				.align('ct')
				.style('bu')
				.size(1, 1)
				.text('Στοιχεία Επιχείρησης')
				.text(`Όνομα Επιχείρησης: ${order.company_name}`)
				.text(`Ημερομηνία: ${formattedDateTime}`)
				.text(`ΑΦΜ: ${order.afm}`)
				.text(`Τηλέφωνο: ${order.phone_number}`)
				.text('\nΠροϊόντα')
				.table(['Προϊόντα', 'Ποσότητα', 'Μονάδα', 'Κατάσταση']);

			// Print each product in the order
			order.products.forEach((product) => {
				printer.table([
					product.product_name,
					product.qty.toString(),
					saleUnitLabels[product.sale_unit],
					''
				]);
			});

			// Send response back to client after printing is triggered
			return json({ success: true });
		});
	} catch (error) {
		console.error('Error processing print request:', error);
		return json({ error: 'Failed to process print request' }, { status: 500 });
	}
};
