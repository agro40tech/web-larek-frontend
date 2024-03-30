import { Model } from './base/model';
import Component from './base/component';
import type { IEvents } from './base/events';
import type {
	ICatalogItemView,
	ICatalogModel,
	IProductView,
	TProduct,
	TProductViewRenderProps,
	TResponseProductList,
} from '../types';

// Модель каталога карточек
// eslint-disable-next-line
class CatalogModel extends Model<{}> implements ICatalogModel {
	protected _items: Map<string, TProduct> = new Map();

	constructor(protected data: object, protected events: IEvents) {
		super(data, events);
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
class CatalogItemView extends Component<TProduct> implements ICatalogItemView {
	protected _dataProduct: TProduct;
	protected _uiCategory: HTMLSpanElement;
	protected _uiImage: HTMLImageElement;
	protected _uiName: HTMLHeadingElement;
	protected _uiPrice: HTMLSpanElement;

	constructor(
		protected container: HTMLButtonElement,
		protected events: IEvents
	) {
		super(container);

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

	set title(value: string) {
		this.setText(this._uiName, value);
	}

	set category(value: string) {
		this.setText(this._uiCategory, value);
	}

	set image(value: string) {
		const altImage = `Изображение товара ${this.title}`;
		this.setImage(this._uiImage, value, altImage);
	}

	set price(value: number) {
		if (value !== null) {
			const priceText = `${value.toString()} синапсов`;
			this.setText(this._uiPrice, priceText);
		} else {
			this.setText(this._uiPrice, 'Бесценно');
		}
	}

	public render = (data: TProduct): HTMLButtonElement => {
		super.render(data);

		this._dataProduct = data;

		return this.container;
	};
}

// Представление каталога
class CatalogView extends Component<{ items: HTMLButtonElement[] }> {
	constructor(protected container: HTMLElement) {
		super(container);
	}

	set items(value: HTMLButtonElement[]) {
		this.container.replaceChildren(...value);
	}
}

// Представление товара в модальном окне
class ProductView
	extends Component<TProductViewRenderProps>
	implements IProductView
{
	protected _uiAddToBasketButton: HTMLButtonElement;
	protected _uiCategory: HTMLSpanElement;
	protected _uiDescription: HTMLParagraphElement;
	protected _uiImage: HTMLImageElement;
	protected _uiName: HTMLHeadingElement;
	protected _uiPrice: HTMLSpanElement;

	protected _id: string;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		// Получаем ui элементы из контейнера
		this._uiAddToBasketButton = container.querySelector('.button');
		this._uiCategory = container.querySelector('.card__category');
		this._uiDescription = container.querySelector('.card__text');
		this._uiImage = container.querySelector('.card__image');
		this._uiName = container.querySelector('.card__title');
		this._uiPrice = container.querySelector('.card__price');

		this._uiAddToBasketButton.addEventListener('click', () => {
			events.emit('busket:add', { id: this._id });
			events.emit('productView:close');
		});
	}

	set product(product: TProduct) {
		this.setText(this._uiName, product.title);
		this.setText(this._uiCategory, product.category);
		this.setText(this._uiDescription, product.description);
		this.setText(this._uiAddToBasketButton, 'В корзину');

		this.setDisabled(this._uiAddToBasketButton, false);

		const altImage = `Изображение товара ${product.title}`;
		this.setImage(this._uiImage, product.image, altImage);

		if (product.price !== null) {
			const priceText = `${product.price.toString()} синапсов`;
			this.setText(this._uiPrice, priceText);
		} else {
			this.setText(this._uiPrice, 'Бесценно');
			this.setText(this._uiAddToBasketButton, 'Нельзя купить');
			this.setDisabled(this._uiAddToBasketButton, true);
		}
	}

	set inBasket(value: boolean) {
		if (value) {
			this.setDisabled(this._uiAddToBasketButton, true);
			this.setText(this._uiAddToBasketButton, 'Уже в корзине');
		}
	}

	public render = (data: TProductViewRenderProps) => {
		super.render(data);

		this._id = data.product.id;

		return this.container;
	};
}

export { CatalogItemView, CatalogModel, CatalogView, ProductView };
