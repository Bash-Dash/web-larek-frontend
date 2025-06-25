import { IEvents } from '../components/base/events';
import {
	IProduct,
	IBasket,
	IOrderForm,
	PaymentMethod,
	FormErrors,
} from '../types';

export class AppData {
	items: IProduct[] = [];
	preview: IProduct | null = null;
	basket: IBasket = {
		items: [],
		total: 0,
	};

	order: IOrderForm = {
		email: '',
		phone: '',
		address: '',
		payment: null,
	};

	constructor(protected events: IEvents) {}

	setItems(items: IProduct[]) {
		this.items = items;
		this.events.emit('items:changed', this.items);
	}

	setPreview(item: IProduct) {
		this.preview = item;
		this.events.emit('preview:changed', this.preview);
	}

	addToBasket(item: IProduct) {
		if (!this.basket.items.includes(item.id)) {
			this.basket.items.push(item.id);
			this.basket.total += item.price ?? 0;
			this.events.emit('basket:changed', this.basket);
		}
	}

	inBasket(item: IProduct) {
		return this.basket.items.includes(item.id);
	}

	removeFromBasket(item: IProduct) {
		this.basket.items = this.basket.items.filter((id) => id !== item.id);
		this.basket.total -= item.price;
		this.events.emit('basket:changed', this.basket);
	}

	clearBasket() {
		this.basket.items = [];
		this.basket.total = 0;
		this.events.emit('basket:changed', this.basket);
	}

	setPayment(method: PaymentMethod) {
		this.order.payment = method;
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		if (field === 'payment') {
			this.order.payment = value as PaymentMethod;
		} else {
			this.order[field] = value;
		}
	}

	setFormError(field: keyof IOrderForm, error: string) {
		this.formErrors[field] = error;
		this.events.emit('form:error', { field, error });
	}

	formErrors: FormErrors = {};

	validateContacts(): boolean {
		this.formErrors = {};

		if (!this.order.email.trim()) {
			this.formErrors.email = 'Введите email';
		}

		if (!this.order.phone.trim()) {
			this.formErrors.phone = 'Введите номер телефона';
		}

		return Object.keys(this.formErrors).length === 0;
	}

	validateOrder(): boolean {
		this.formErrors = {};

		if (!this.order.address.trim()) {
			this.formErrors.address = 'Введите адрес доставки';
		}

		if (!this.order.payment) {
			this.formErrors.payment = 'Выберите способ оплаты';
		}

		Object.entries(this.formErrors).forEach(([field, error]) => {
			this.events.emit('form:error', { field, error });
		});

		return Object.keys(this.formErrors).length === 0;
	}
}
