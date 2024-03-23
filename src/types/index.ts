import { IEvents } from '../components/base/events';

// Базовые интерфейсы
export interface IView {
	render: (data: object) => HTMLElement;
}

export interface IViewConstructor {
	new (container: HTMLElement, events?: IEvents): IView;
}

// Товар
export type TProduct = {
	category: string;
	name: string;
	image: string;
	price: number;
	description: string;
};

export interface IProductView extends IView {
	uiCategory: HTMLSpanElement;
	uiName: HTMLHeadingElement;
	uiImage: HTMLImageElement;
	uiPrice: HTMLSpanElement;
	uiDescription: HTMLParagraphElement;
	uiAddToBusketButton: HTMLButtonElement;
}

// Каталог товаров
export interface ICatalogModel {
	// <key, Product>
	items: Map<string, TProduct>;

	setItems: (items: TProduct[]) => void;
	getItem: (id: string) => TProduct;
}

export interface ICatalogItemView extends IView {
	uiCategory: HTMLSpanElement;
	uiName: HTMLHeadingElement;
	uiImage: HTMLImageElement;
	uiPrice: HTMLSpanElement;
	uiAddToBasketButton: HTMLButtonElement;
}

// Корзина товаров
export interface IBasketModel {
	// <key, countProduct>
	items: Map<string, number>;

	removeItem: (id: string) => void;
	addItem: (id: string) => void;
	changed: () => void;
}

export interface IBasketItemView extends IView {
	uiTotalCount: HTMLSpanElement;
	uiTitle: HTMLSpanElement;
	uiTotalPrice: HTMLSpanElement;
	uiRemoveButton: HTMLButtonElement;
	id: string;
}

// Данные пользователя
export enum EPaymentType {
	online = 'ONLINE',
	onReceipt = 'ON_RECEIP',
}

export interface IDataUserModel {
	paymentMethod: EPaymentType;
	deliveryAddress: string;
	email: string;
	phoneNumber: string;

	setPayment: (method: EPaymentType) => this;
	setAddress: (address: string) => this;
	setEmail: (email: string) => this;
	setPhoneNumber: (number: string) => this;
}

export interface IDataUserOrderView extends IView {
	uiPaymentMethod: HTMLButtonElement[];
	uiDeliveryAddress: HTMLInputElement;
}

export interface IDataUserContactsView extends IView {
	uiEmail: HTMLInputElement;
	uiPhoneNumber: HTMLInputElement;
}

// Уведомление об успешном заказе
export interface ISuccessOrderView extends IView {
	uiDescription: HTMLParagraphElement;
}
