export interface Product {
	product_id: number;
	image_url?: string;
	product_name: string;
	product_code: string;
	is_disabled: boolean;
	sale_unit: string;
	qty?: number;
}

export interface Order {
	order_id: number;
	user_order_number: string;
	timestamp: string;
	status: string;
	company_name: string;
}

export interface Customer {
	user_id: number;
	company_name: string;
	email: string;
	phone_number: string;
	is_account_disabled: boolean;
}
