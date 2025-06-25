## Документация проекта "Веб-ларек"

**Стек:** HTML, SCSS, TypeScript, Webpack

### Структура проекта:

```
src/ — исходные файлы проекта
src/components/ — папка с компонентами
src/components/base/ — папка с базовыми классами
src/pages/index.html — HTML-файл главной страницы
src/types/index.ts — файл с интерфейсами и типами данных
src/index.ts — точка входа приложения
src/scss/styles.scss — корневой файл стилей
src/utils/constants.ts — файл с константами
src/utils/utils.ts — файл с утилитами
```

### Установка и запуск:

```
npm install
npm run start
```

или

```
yarn
yarn start
```

### Сборка:

```
npm run build
```

или

```
yarn build
```

## Типы данных

 *Базовые типы данных*

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
 *Интерфейсы действий*

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICardBasketActions {
	onDelete: (event: MouseEvent) => void;
}

export interface ICardPreviewActions {
	onClick: (event: MouseEvent) => void;
}

*Модели данных*

export interface IBasket {
	items: string[];
	total: number;
}

export interface IOrder extends IOrderForm {
	items: string[];
}

*Формы и валидация*

export type PaymentMethod = 'cash' | 'card';

export interface IOrderForm {
	email: string;
	phone: string;
	address: string;
	payment: PaymentMethod;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

*Результаты операций*

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


## Архитектура

Проект реализован на основе паттерна MVP (Model-View-Presenter):
	Model  - хранит данные и управляет бизнес-логикой приложения.
	View  - отвечает за отображение данных на интерфейсе пользователя.
	Presenter - осуществляет взаимодействие между Model и View.

Описание взаимодействия:
	Пользователь совершает действие.
	View уведомляет Presenter.
	Presenter обновляет Model.
	Model уведомляет Presenter об изменениях.
	Presenter обновляет View.


## Базовый код 

### Класс Api 

Класс, который реализует логику взаимодействия с API сервера.

**Методы:**

~ get - используется для получения данных с сервера.
~ post - используется для отправки данных на сервер.
~ handleResponse - используется для обработки запроса с сервера.


### Класс Component

Абстрактный класс, который реализует логику взаимодействия с компонентами отображения.

**Методы:**

~ toggleClass - позволяет переключать классы для элемента.
~ setText - позволяет установить текстовое сообщение.
~ setDisabled - позволяет сменить статус блокировки.
~ setHidden - позволяет скрыть элемент.
~ setVisible - позволяет показать элемент.
~ setImage - позволяет установить изображение и добавить описание.
~ render - позволяет записать переданные данные в текущий объект и вернуть его.


### Класс events

Класс позволяет подписываться на события и уведомлять подписчиков о наступлении события.

**Методы:**

~ on(event, handler)— подписка на событие.
~ off(event, handler) — отписка от события.
~ emit(event, payload) — вызов события.
~ onAll(handler) — подписка на все события.
~ offAll() — удалить все подписки.
~ trigger - возвращает функцию-триггер, генерирующую событие при вызове.


## Model:

### Класс AppData

Хранит все данные приложения, массив всех продуктов, корзину, данные о заказе, который оформляет пользователь.

* Управление каталогом товаров
setItems(items: IProduct[]) - обновляет список товаров в каталоге и инициирует рендеринг.
setPreview(item: IProduct) - устанавливает текущий просматриваемый товар для модального окна.

* Работа с корзиной
inBasket(item: IProduct): boolean - проверяет наличие товара в корзине.
addToBasket(item: IProduct) - добавляет товар в корзину.
removeFromBasket(item: IProduct) - удаляет товар из корзины.
clearBasket() - полностью очищает корзину.

* Оформление заказа
setPayment(method: PaymentMethod) - сохраняет выбранный способ оплаты ('card'/'cash').
setOrderField(field: keyof IOrderForm, value: string) - устанавливает значение поля формы (адрес, email, телефон).
setFormError(field: keyof IOrderForm, error: string) - записывает ошибку валидации для конкретного поля.

* Валидация форм
validateOrder(): boolean - 	   Проверяет: • Заполненность адреса
                                          • Выбор способа оплаты	
validateContacts(): boolean -  Проверяет: • Формат email
                                          • Наличие телефона	

### Класс LarekApi

Класс наследуется от класса Api расширяя его функциональность.
constructor(cdn: string, baseUrl: string, options?: RequestInit) принимающий в параметры ссылку на изображение, базовый URL к серверу и набор возможных дополнительных опции.

**Методы:**

~ getProductList(): Promise<IProduct[]> - получает полный список товаров с сервера.
~ getProductItem(id: string): Promise<IProduct> - получает детальную информацию о конкретном товаре.
~ orderProduct(order: IOrder): Promise<IOrderResult> - отправляет данные заказа на сервер для обработки.


## View

### Класс Form

Отвечает за базовую функциональность форм, наследует методы и свойства класса Component.

Конструктор:
container - ссылка на DOM-элемент
events - хранилище событий

**Методы:**

~ protected onInputChange(field: keyof T, value: string) - обрабатывает изменения в полях формы и генерирует стандартизированные события.
~ render(state: Partial<T> & IFormState): HTMLElement - обновляет форму данными и состоянием валидации.


### Класс Modal

Отвечает за отображение модальных окон, наследует методы и свойства класса Component.

Конструктор:
container - ссылка на DOM-элемент
events - хранилище событий

**Методы**

~ open() - открывает модальное окно:
	- добавляет класс modal_active
	- блокирует фоновый скролл
	- вешает обработчик Escape
~ close() - закрывает модальное окно:
	- удаляет класс modal_active
	- восстанавливает скролл
	- очищает контент
~ render(data: IModalData): HTMLElement - метод для отрисовки контента в модальном окне с автоматическим открытием. Связывает данные с интерфейсом и активирует модалку.


### Класс Basket

Отвечает за отображение корзины, наследует методы и свойства класса Component.

Конструктор:
container - ссылка на DOM-элемент
events - хранилище событий
 
**Методы:**

~ items(items: HTMLElement[]) - обновляет содержимое списка товаров в корзине.
~ total(total: number) - обновляет отображение итоговой суммы в корзине.


### Класс Card

Отвечает за отображение товаров на главной странице.

Конструктор - принимает контейнер и обработчик клика onClick
render() -	добавляет базовое оформление (название, цена, категория)

*CardPreview* отвечает за отображение карточки, выбранной пользователем.
set button() -	устанавливает текст кнопки ("Купить"/"Убрать")
set description() - добавляет/обновляет описание товара
set category() - применяет стили для категории

*CardBasket* отвечает за отображение карточки товара в корзине.
set index() - нумерация позиций в корзине
set price() - форматирует цену


### Класс Contacts 

Расширяет класс Form и отвечает за отображение контактной информации (email и телефон).

Конструктор:
container - ссылка на DOM-элемент, в котором будет размещена форма
events - хранилище событий

**Методы:**

set email() - заполняет поле email
set phone()	- заполняет поле телефона
get data() - возвращает текущие данные формы


### Класс Order

Отвечает за управление формой заказа, наследует методы и свойства класса Component.

Конструктор:
container - ссылка на DOM-элемент, в котором будет размещена форма
events - хранилище событий

**Метод:**

~setPayment(method: PaymentMethod) - фиксирует выбранный способ оплаты и визуально выделяет активную кнопку.


### Класс Page

Отвечает за управление основными элементами на странице, наследует методы и свойства класса Component.

Конструктор:
container - ссылка на DOM-элемент
events - хранилище событий

**Свойства:**
~ counter - отображает количество товаров в корзине в шапке сайта
~ catalog - содержит массив DOM-элементов карточек товаров для отрисовки в каталоге
~ locked - блокирует интерфейс при открытии модальных окон


### Класс Success

 Отвечает за управление модальное окно успеха, наследует методы и свойства класса Component.плате товара.

Конструктор:
container - ссылка на DOM-элемент
actions - объект с функцией-обработчиком события закрытия (onClick).

**Метод:** 
~ set total(value: number) - обновляет итоговую сумму заказа в сообщении об успешном оформлении.

