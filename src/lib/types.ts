export interface Product {
	product_id: number;
	image_url?: string;
	product_name: string;
	product_code: string;
	is_disabled: boolean;
	sale_units: ('kg' | 'piece' | 'crate' | 'bunch' | 'cup')[];
	category: 'fruits' | 'vegetables' | 'bundles' | 'other';
	qty?: number;
	selected_sale_unit?: string;
}

export interface Customer {
	userId: number;
	companyName: string;
	userCode: string;
	email: string;
	phoneNumber: string;
	afm: string;
	streetAddress: string;
	city: string;
	postalCode: string;
	isAccountDisabled: boolean;
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
