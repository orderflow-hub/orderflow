export interface Product {
	product_id: number;
	image_url?: string;
	product_name: string;
	product_code: string;
	is_disabled: boolean;
	sale_units: ('kg' | 'piece' | 'crates')[];
	category: 'fruits' | 'vegetables' | 'other';
	qty?: number;
	selected_sale_unit?: string;
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

export interface Order {
	order_id: number;
	status: 'pending' | 'complete';
	user_order_number: number;
	company_name: string;
	timestamp: string;
	street_address: string;
	city: string;
	postal_code: string;
	phone_number: string;
	afm: string;
	products: Product[];
}
