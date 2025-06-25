import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import {
	ProductCategory,
	IProduct,
	ICardActions,
	ICardBasketActions,
	ICardPreviewActions,
} from '../types';

export class Card extends Component<IProduct> {
	private _title: HTMLElement;
	private _image: HTMLImageElement;
	private _price: HTMLElement;
	private _category: HTMLElement;

	constructor(container: HTMLElement, actions: ICardActions) {
		super(container);

		this._title = ensureElement('.card__title', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._price = ensureElement('.card__price', container);
		this._category = ensureElement('.card__category', container);

		this.container.addEventListener('click', actions.onClick);
	}

	render(data: IProduct): HTMLElement {
		this.setText(this._title, data.title);

		this.setText(
			this._price,
			data.price === null ? 'Бесценно' : `${data.price} синапсов`
		);

		this._category.className = 'card__category';
		if (data.category) {
			const categoryClass = `card__category_${
				ProductCategory[data.category as keyof typeof ProductCategory]
			}`;
			this._category.classList.add(categoryClass);
			this.setText(this._category, data.category);
		}

		this.setImage(this._image, data.image, data.title);
		this.container.dataset.id = data.id;

		return this.container;
	}
}

export class CardBasket extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _index: HTMLElement;

	constructor(container: HTMLElement, actions: ICardBasketActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);
		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._button.addEventListener('click', actions.onDelete);
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: string) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		this.setDisabled(this._button, !value);
	}

	set index(value: number) {
		this.setText(this._index, String(value));
	}
}

export class CardPreview extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _description: HTMLElement;
	protected _image: HTMLImageElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions: ICardPreviewActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._description = ensureElement<HTMLElement>('.card__text', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);

		this._button.addEventListener('click', actions.onClick);
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
			this.setDisabled(this._button, true);
		} else {
			this.setText(this._price, `${value} синапсов`);
			this.setDisabled(this._button, false);
		}
	}

	set category(value: keyof typeof ProductCategory) {
		this.setText(this._category, value);
		this.toggleClass(
			this._category,
			`card__category_${ProductCategory[value]}`,
			true
		);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}
}
