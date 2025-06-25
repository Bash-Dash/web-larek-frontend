export const ProductCategory: Record<string, string> = {
	'софт-скил': 'soft',
	другое: 'other',
	дополнительное: 'additional',
	кнопка: 'button',
	'хард-скил': 'hard',
};
export type ProductCategory = keyof typeof ProductCategory;

export interface IProduct {
	id: string;
	title: string;
	price: number | null;
	description?: string;
	image?: string;
	category?: string;
	index?: number;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICardBasketActions {
	onDelete: (event: MouseEvent) => void;
}

export interface ICardPreviewActions {
	onClick: (event: MouseEvent) => void;
}

export interface IBasket {
	items: string[];
	total: number;
}

export interface IOrder extends IOrderForm {
	items: string[];
}

export type PaymentMethod = 'cash' | 'card';

export interface IOrderForm {
	email: string;
	phone: string;
	address: string;
	payment: PaymentMethod;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IOrderResult {
	id: string;
	total: number;
}

export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}
