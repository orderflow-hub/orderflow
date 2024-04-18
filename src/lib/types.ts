export interface Product {
	product_id: number;
	image_url?: string;
	product_name: string;
	product_code: string;
	is_available: boolean;
	sale_unit: 'kg' | 'piece';
	qty: number;
}

export interface Customer {
	user_id: number;
	company_name: string;
	user_code: string;
	email: string;
	phone_number: string;
	afm: string;
	street_address: string;
	city: string;
	postal_code: string;
	is_account_disabled: boolean;
}
