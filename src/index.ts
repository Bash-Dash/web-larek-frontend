import './scss/styles.scss';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { IProduct, IOrderForm, IOrderResult } from './types';
import { AppData } from './components/AppData';
import { Card, CardPreview, CardBasket } from './components/Card';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);
const appData = new AppData(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderView = new Order(cloneTemplate(orderTemplate), events);
const contactsView = new Contacts(cloneTemplate(contactsTemplate), events);
const successView = new Success(cloneTemplate(successTemplate), {
	onClick: () => modal.close(),
});

events.on('items:changed', (items: IProduct[]) => {
	page.catalog = items.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('preview:changed', item),
		});
		return card.render(item);
	});
});
events.on('preview:changed', (item: IProduct) => {
	const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (appData.inBasket(item)) {
				appData.removeFromBasket(item);
				cardPreview.button = 'В корзину';
			} else {
				appData.addToBasket(item);
				cardPreview.button = 'Убрать из корзины';
			}
			modal.close();
		},
	});
	cardPreview.button = appData.inBasket(item)
		? 'Убрать из корзины'
		: 'В корзину';
	modal.render({ content: cardPreview.render(item) });
});

events.on('basket:open', () => {
	modal.render({
		content: basketView.render(),
	});
});

events.on('basket:close', () => {
	modal.close();
});

events.on('basket:changed', () => {
	const basketItems = appData.items.filter((product) =>
		appData.basket.items.includes(product.id)
	);

	const basketCards = basketItems.map((item, index) => {
		const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
			onDelete: () => appData.removeFromBasket(item),
		});
		card.index = index + 1;
		return card.render(item);
	});

	basketView.items = basketCards;
	basketView.total = appData.basket.total;
	page.counter = appData.basket.items.length;
});

events.on('order:open', () => {
	modal.render({
		content: orderView.render({
			payment: null,
			address: appData.order.address || '',
			valid: !!appData.order.address,
			errors: [],
		}),
	});
});

events.on(/^order\..*:change$/, (data: { field: string; value: string }) => {
	appData.setOrderField(data.field as keyof IOrderForm, data.value);
	const valid = appData.validateOrder();
	orderView.valid = valid;
	orderView.errors = Object.values(appData.formErrors).join('; ');
});

events.on('order:submit', () => {
	const isValid = appData.validateOrder();
	if (isValid) {
		modal.render({
			content: contactsView.render({
				email: appData.order.email || '',
				phone: appData.order.phone || '',
				valid: !!appData.order.email && !!appData.order.phone,
				errors: [],
			}),
		});
	}
});

events.on(/^contacts\..*:change$/, (data: { field: string; value: string }) => {
	appData.setOrderField(data.field as keyof IOrderForm, data.value);
	const valid = appData.validateContacts();
	contactsView.valid = valid;
	contactsView.errors = Object.values(appData.formErrors).join('; ');
});

events.on('contacts:submit', () => {
	const isValid = appData.validateContacts() && appData.validateOrder();

	if (isValid) {
		api
			.orderProduct({
				...appData.order,
				...appData.basket,
			})
			.then((result: IOrderResult) => {
				appData.clearBasket();
				successView.total = result.total;
				modal.render({
					content: successView.render(),
				});
			})
			.catch(console.error);
	}
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getProductList()
	.then(appData.setItems.bind(appData))
	.catch((err) => {
		console.error(err);
	});
