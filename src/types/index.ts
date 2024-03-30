/**
 * Базовые интерфейсы
 */

// Базовый класс компонента
export interface IComponent<T> {
	toggleClass: (
		element: HTMLElement,
		className: string,
		force?: boolean
	) => void;
	setDisabled: (element: HTMLElement, state: boolean) => void;
	render: (data?: Partial<T>) => HTMLElement;
}

// Базовый класс модели
export interface IModel {
	emitChanges: (event: string, payload?: object) => void;
}

// Тип ответа при запросе листа товаров
export type TResponseProductList = {
	items: TProduct[];
	total: number;
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Базовый класс api
export interface IApi {
	readonly baseUrl: string;
	get: (uri: string) => Promise<object>;
	post: (uri: string, data: object, method: ApiPostMethods) => Promise<object>;
}

// Базовый класс форм
export interface IForm {
	valid: boolean;
	errors: string;
	dataSubmit: object;
}

// Базовой класс модальных окон
export interface IModalRenderProps {
	content: HTMLElement;
}

export interface IModal {
	open: () => void;
	close: () => void;
	render(data: IModalRenderProps): HTMLElement;
}

// Базовый тип товара
export type TProduct = {
	id: string;
	category: string;
	title: string;
	image: string;
	price: number;
	description: string;
};

/**
 * Компоненты приложения
 */

// Каталог товаров
export interface ICatalogModel {
	setItems: (data: TResponseProductList) => void;
	getItem: (id: string) => TProduct;
}

// Представитель товара в каталоге
export interface ICatalogItemView {
	title: string;
	category: string;
	image: string;
	price: number;
	render: (data: TProduct) => HTMLButtonElement;
}

// Представитель каталога
export interface ICatalogView {
	items: HTMLButtonElement[];
}

// Представитель превью товара
export type TProductViewRenderProps = {
	product: TProduct;
	inBasket: boolean;
};

export interface IProductView {
	product: TProduct;
	inBasket: boolean;
	render: (data: TProductViewRenderProps) => HTMLElement;
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
	inBasket: (id: string) => boolean;
}

// Представитель товара в корзине
export type TBasketItemRenderProps = {
	product: TProduct;
	totalCount: number;
	totalPrice: number;
};

export interface IBasketItemView {
	product: TProduct;
	totalCount: number;
	totalPrice: number;
	render: (data: TBasketItemRenderProps) => HTMLElement;
}

// Представитель корзины
export type TBasketRenderProps = {
	items: HTMLElement[];
	totalPrice: number;
};

export interface IBasketView {
	items: HTMLElement[];
	totalPrice: number;
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

// Представитель окна успешной оплаты
export interface ISuccessView {
	totalPrice: number;
}

// Представитель страницы
export interface IPageView {
	setCounter: (value: number) => void;
	lockPage: (value: boolean) => void;
}

// Класс с запросами к api
export interface IAuctionApi {
	getProductList: () => Promise<TResponseProductList>;
	sendOrder: (data: { userData: TUserDataObject; itemsId: string[] }) => void;
}
