import { Form, IFormState } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Contacts extends Form<IOrderForm> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._email = ensureElement<HTMLInputElement>(
			'.form__input[name="email"]',
			container
		);
		this._phone = ensureElement<HTMLInputElement>(
			'.form__input[name="phone"]',
			container
		);

		this._email.addEventListener('input', () => {
			this.onInputChange('email', this._email.value);
		});

		this._phone.addEventListener('input', () => {
			this.onInputChange('phone', this._phone.value);
		});
	}

	set email(value: string) {
		this._email.value = value;
	}

	set phone(value: string) {
		this._phone.value = value;
	}

	get data(): Partial<IOrderForm> {
		return {
			email: this._email.value,
			phone: this._phone.value,
		};
	}

	render(state?: Partial<IOrderForm> & IFormState) {
		if (state) {
			this._email.value = state.email || '';
			this._phone.value = state.phone || '';
		}
		return super.render(state);
	}
}
