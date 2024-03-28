import Component from './base/component';
import type { IModalView } from '../types';
import type { IEvents } from './base/events';

class ModalView extends Component implements IModalView {
	protected _uiCloseButton: HTMLButtonElement;
	protected _childContainer: HTMLElement;
	protected _child: HTMLElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super();

		this._uiCloseButton = container.querySelector('.modal__close');
		this._childContainer = container.querySelector('.modal__content');

		this._uiCloseButton.addEventListener('click', () =>
			events.emit('modal:close')
		);
	}

	// Делает модальное окно видимым
	protected _open = () => {
		this.toggleClass(this.container, 'modal_active', true);
	};

	// Делает модальное окно не видимым и удаляет его содержимое
	public close = () => {
		this.toggleClass(this.container, 'modal_active', false);
		this._childContainer.removeChild(this._child);
	};

	public render = (child: HTMLElement) => {
		this._child = child;
		this._childContainer.appendChild(child);

		// Делаем модальное окно видимым
		this._open();

		return this.container;
	};
}

export default ModalView;
