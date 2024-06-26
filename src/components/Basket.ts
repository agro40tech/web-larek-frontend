import { Model } from './base/model';
import Component from './base/component';
import type { IEvents } from './base/events';
import type {
	IBasketItemView,
	IBasketModel,
	IBasketView,
	TBasketItemRenderProps,
	TBasketRenderProps,
	TProduct,
} from '../types';

// Модель корзины
// eslint-disable-next-line
class BasketModel extends Model<{}> implements IBasketModel {
	protected _items: Map<string, number> = new Map();
	protected _totalPrice = 0;

	constructor(protected data: object, protected events: IEvents) {
		super(data, events);
	}

	// Добавляет товар в корзину
	public addItem = (id: string): void => {
		if (!this._items.has(id)) this._items.set(id, 0);

		this._items.set(id, this._items.get(id) + 1);

		this._changed();
	};

	// Удаляет товар из корзины
	public removeItem = (id: string): void => {
		if (!this._items.has(id)) return;

		if (this._items.get(id) > 0) {
			this._items.set(id, this._items.get(id) - 1);

			if (this._items.get(id) === 0) this._items.delete(id);
		}

		this._changed();
	};

	// Очищает стоимость корзины
	public clearTotalPrice = (): void => {
		this._totalPrice = 0;
	};

	// Очищает корзину от товаров
	public clear = (): void => {
		this._items.clear();

		this.clearTotalPrice();
		this._changed();
	};

	// Добавляет цену товара к итоговой цене корзины
	public incrementTotalPrice = (totalPriceProduct: number) => {
		this._totalPrice = this._totalPrice + totalPriceProduct;
	};

	// Возвращает общую стоимость корзины
	public getTotalPrice = (): number => {
		return this._totalPrice;
	};

	// Возвращает массив ids товаров
	public getIds = (): string[] => {
		const resultArr: string[] = [];
		const keys = Array.from(this._items.keys());

		keys.map((key) => {
			const value = this._items.get(key);

			if (value > 1) {
				for (let i = 0; i < value; i++) {
					resultArr.push(key);
				}
			} else {
				resultArr.push(key);
			}
		});
		return resultArr;
	};

	// Проверяет на наличие в корзине
	public inBasket = (id: string): boolean => {
		if (Array.from(this._items.keys()).includes(id)) {
			return true;
		}

		return false;
	};

	// Создает событие и отправляет коллекцию товаров
	protected _changed = (): void => {
		this.emitChanges('busket:changed', {
			data: Array.from(this._items),
		});
	};
}

// Карточка товара в корзине
class BasketItemView
	extends Component<TBasketItemRenderProps>
	implements IBasketItemView
{
	protected _uiTotalPrice: HTMLSpanElement;
	protected _uiTotalCount: HTMLSpanElement;
	protected _uiTitle: HTMLSpanElement;
	protected _uiRemoveButton: HTMLButtonElement;

	protected _id: string;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		// Получаем ui элементы из контейнера
		this._uiRemoveButton = container.querySelector('.basket__item-delete');
		this._uiTotalCount = container.querySelector('.basket__item-index');
		this._uiTotalPrice = container.querySelector('.card__price');
		this._uiTitle = container.querySelector('.card__title');

		// Устанавливаем слушатель события на кнопку удаления товара из корзины
		this._uiRemoveButton.addEventListener('click', () =>
			events.emit('busket:remove', { id: this._id })
		);
	}

	set product(value: TProduct) {
		this.setText(this._uiTitle, value.title);
	}

	set totalCount(value: number) {
		this.setText(this._uiTotalCount, value);
	}

	set totalPrice(value: number) {
		this.setText(this._uiTotalPrice, `${value.toString()} синапсов`);
	}

	public render = (data: TBasketItemRenderProps): HTMLElement => {
		// Если предыдущий id уже был отрендерин то возвращаем текущий контейнер
		if (data.product.id === this._id) {
			return this.container;
		}

		super.render(data);

		this._id = data.product.id;

		return this.container;
	};
}

// Представление корзины
class BasketView extends Component<TBasketRenderProps> implements IBasketView {
	protected _uiChildContainer: HTMLUListElement;
	protected _uiOrderButton: HTMLButtonElement;
	protected _uiTotalPrice: HTMLSpanElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		this._uiChildContainer = container.querySelector('.basket__list');
		this._uiOrderButton = container.querySelector('.basket__button');
		this._uiTotalPrice = container.querySelector('.basket__price');

		this._uiOrderButton.addEventListener('click', () => {
			events.emit('order:open');
		});

		this.setDisabled(this._uiOrderButton, true);
	}

	set items(items: HTMLElement[]) {
		this._uiChildContainer.replaceChildren(...items);
	}

	set totalPrice(value: number) {
		const priceText = `${value} синапсов`;
		this.setText(this._uiTotalPrice, priceText);

		if (value === 0) {
			this.setDisabled(this._uiOrderButton, true);
		} else {
			this.setDisabled(this._uiOrderButton, false);
		}
	}
}

export { BasketModel, BasketItemView, BasketView };
