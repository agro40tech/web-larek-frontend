import { IView } from '../types';
import Component from './base/component';
import { IEvents } from './base/events';

class SuccessView extends Component implements IView {
	protected _uiSuccessButton: HTMLButtonElement;
	protected _uiSuccessDescription: HTMLSpanElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super();

		this._uiSuccessButton = container.querySelector('.order-success__close');
		this._uiSuccessDescription = container.querySelector(
			'.order-success__description'
		);

		this._uiSuccessButton.addEventListener('click', () => {
			events.emit('modal:close');
		});
	}

	render(data: { totalPrice: number }) {
		const totalPirceText = `Списано ${data.totalPrice} синапсов`;
		this.setText(this._uiSuccessDescription, totalPirceText);

		return this.container;
	}
}

export default SuccessView;
