import Component from './base/component';
import type { IPageView } from '../types';
import type { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

// eslint-disable-next-line
class PageView extends Component<{}> implements IPageView {
	protected _uiBasketButton: HTMLButtonElement;
	protected _uiCatalog: HTMLElement;
	protected _uiCounter: HTMLSpanElement;
	protected _uiWrapper: HTMLElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		this._uiBasketButton = ensureElement<HTMLButtonElement>('.header__basket');
		this._uiCatalog = ensureElement<HTMLElement>('.gallery');
		this._uiCounter = ensureElement<HTMLElement>('.header__basket-counter');
		this._uiWrapper = ensureElement<HTMLElement>('.page__wrapper');

		this._uiBasketButton.addEventListener('click', () => {
			this.events.emit('busket:open');
		});
	}

	// Отображает кол-во товаров в корзине
	public setCounter(value: number) {
		this.setText(this._uiCounter, value.toString());
	}

	// Блокирует прокрутку страницы
	public lockPage(value: boolean) {
		this.toggleClass(this._uiWrapper, 'page__wrapper_locked', value);
	}
}

export default PageView;
