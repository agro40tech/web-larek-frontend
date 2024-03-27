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
	id: string;
	category: string;
	title: string;
	image: string;
	price: number;
	description: string;
};

// Каталог товаров
export interface ICatalogModel {
	setItems: (items: TProduct[]) => void;
	getItem: (id: string) => TProduct;
}

// Корзина товаров
export interface IBasketModel {
	removeItem: (id: string) => void;
	addItem: (id: string) => void;
	clear: () => void;
	incrementTotalPrice: (totalPriceProduct: number) => void;
	getTotalPrice: () => number;
	clearTotalPrice: () => void;
	getIds: () => string[];
}

export interface IBasketView extends IView {
	getContainer: () => HTMLElement;
}

// Данные пользователя
export type TUserDataObject = {
	address: string;
	email: string;
	paymentMethod: string;
	phoneNumber: string;
};

export interface IUserDataModel {
	setPayment: (method: string) => this;
	setAddress: (address: string) => this;
	setEmail: (email: string) => this;
	setPhoneNumber: (number: string) => this;
	getUserData: () => TUserDataObject;
}

export interface IPageView {
	setCounter: (value: number) => void;
	lockPage: (value: boolean) => void;
}

export interface IModalView extends IView {
	close: () => void;
}

export type TResponseProductList = {
	items: TProduct[];
	total: number;
};

export interface IAuctionApi {
	getProductList: () => Promise<TResponseProductList>;
	sendOrder: (data: { userData: TUserDataObject; itemsId: string[] }) => void;
}

export interface IForm {
	valid: boolean;
	errors: string;
	validate: (value: string) => boolean;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	readonly baseUrl: string;
	get: (uri: string) => Promise<object>;
	post: (uri: string, data: object, method: ApiPostMethods) => Promise<object>;
}

export interface IComponent {
	toggleClass: (
		element: HTMLElement,
		className: string,
		force?: boolean
	) => void;
	setDisabled: (element: HTMLElement, state: boolean) => void;
}

export interface IModel {
	emitChanges: (event: string, payload?: object) => void;
}
