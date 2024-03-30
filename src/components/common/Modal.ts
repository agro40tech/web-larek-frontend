import Component from '../base/component';
import type { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IModal, IModalRenderProps } from '../../types';

class Modal extends Component<IModalRenderProps> implements IModal {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	public open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	public close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	public render(data: IModalRenderProps): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}

export default Modal;
