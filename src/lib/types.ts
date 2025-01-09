export interface Product {
	productId: number;
	imageUrl?: string;
	productName: string;
	productCode: string;
	isDisabled: boolean;
	saleUnits: ('kg' | 'piece' | 'crate' | 'bunch' | 'cup')[];
	category: 'fruits' | 'vegetables' | 'bundles' | 'other';
	qty?: number;
	selectedSaleUnit?: string;
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
	orderId: number;
	status: 'pending' | 'complete';
	userOrderNumber: number;
	companyName: string;
	timestamp: string;
	streetAddress: string;
	city: string;
	postalCode: string;
	phoneNumber: string;
	afm: string;
	products: Product[];
}
