import { Model } from './base/model';
import Component from './base/component';
import type { IEvents } from './base/events';
import type {
	ICatalogModel,
	IView,
	TProduct,
	TResponseProductList,
} from '../types';

// Модель каталога карточек
class CatalogModel extends Model implements ICatalogModel {
	protected _items: Map<string, TProduct> = new Map();

	constructor(protected events: IEvents) {
		super(events);
	}

	// Ищет товар по id, в случае если поиск успешен возвращает этот товар.
	public getItem = (id: string): TProduct => {
		if (!this._items.has(id)) return;

		return this._items.get(id);
	};

	// Инициализирует каталог продуктов.
	public setItems = (data: TResponseProductList): void => {
		data.items.map((item) => {
			this._items.set(item.id, item);
		});

		this.emitChanges('catalog:init', {
			items: Array.from(this._items.values()),
		});
	};
}

// Представление карточки товара в катологе
class CatalogItemView extends Component implements IView {
	protected _dataProduct: TProduct;
	protected _uiCategory: HTMLSpanElement;
	protected _uiImage: HTMLImageElement;
	protected _uiName: HTMLHeadingElement;
	protected _uiPrice: HTMLSpanElement;

	constructor(
		protected container: HTMLButtonElement,
		protected events: IEvents
	) {
		super();

		// Получаем ui элементы из контейнера
		this._uiCategory = container.querySelector('.card__category');
		this._uiImage = container.querySelector('.card__image');
		this._uiName = container.querySelector('.card__title');
		this._uiPrice = container.querySelector('.card__price');

		// Устанавливаем слушатель на карточку
		container.addEventListener('click', () =>
			events.emit('cardPreview:open', {
				data: this._dataProduct,
			})
		);
	}

	public render = (data: TProduct): HTMLButtonElement => {
		// Устанавливаем данные товара в ui элементы
		this.setText(this._uiCategory, data.category);
		this.setText(this._uiName, data.title);

		const altImage = `Изображение товара ${data.title}`;
		this.setImage(this._uiImage, data.image, altImage);

		this._dataProduct = data;

		if (data.price !== null) {
			const priceText = `${data.price.toString()} синапсов`;
			this.setText(this._uiPrice, priceText);
		} else {
			this.setText(this._uiPrice, 'Бесценно');
		}

		return this.container;
	};
}

// Представление каталога
class CatalogView extends Component implements IView {
	constructor(protected container: HTMLElement) {
		super();
	}

	public render = (items: HTMLElement[]): HTMLElement => {
		this.container.replaceChildren(...items);

		return this.container;
	};
}

// Представление товара в модальном окне
class ProductView extends Component implements IView {
	protected _uiAddToBasketButton: HTMLButtonElement;
	protected _uiCategory: HTMLSpanElement;
	protected _uiDescription: HTMLParagraphElement;
	protected _uiImage: HTMLImageElement;
	protected _uiName: HTMLHeadingElement;
	protected _uiPrice: HTMLSpanElement;

	protected _id: string;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super();

		// Получаем ui элементы из контейнера
		this._uiAddToBasketButton = container.querySelector('.button');
		this._uiCategory = container.querySelector('.card__category');
		this._uiDescription = container.querySelector('.card__text');
		this._uiImage = container.querySelector('.card__image');
		this._uiName = container.querySelector('.card__title');
		this._uiPrice = container.querySelector('.card__price');

		this._uiAddToBasketButton.addEventListener('click', () => {
			events.emit('busket:add', { id: this._id });
			events.emit('modal:close');
		});
	}

	public render = (data: { item: TProduct; inBasket?: boolean }) => {
		// Вносим данные в ui элементы
		this.setText(this._uiCategory, data.item.category);
		this.setText(this._uiName, data.item.title);
		this.setText(this._uiDescription, data.item.description);

		const altImage = `Изображение товара ${data.item.title}`;
		this.setImage(this._uiImage, data.item.image, altImage);

		if (!data.inBasket && data.item.price !== null) {
			this.setDisabled(this._uiAddToBasketButton, false);
			this.setText(this._uiAddToBasketButton, 'В корзину');
			const priceText = `${data.item.price.toString()} синапсов`;
			this.setText(this._uiPrice, priceText);
		} else if (data.inBasket) {
			this.setDisabled(this._uiAddToBasketButton, true);
			this.setText(this._uiAddToBasketButton, 'Уже в корзине');
		} else if (data.item.price === null) {
			this.setText(this._uiPrice, 'Бесценно');
			this.setDisabled(this._uiAddToBasketButton, true);
			this.setText(this._uiAddToBasketButton, 'Нельзя купить');
		}

		this._id = data.item.id;

		return this.container;
	};
}

export { CatalogItemView, CatalogModel, CatalogView, ProductView };
