import { ISuccessView } from '../types';
import { IEvents } from './base/events';
import Component from './base/component';

class SuccessView
	extends Component<{ totalPrice: number }>
	implements ISuccessView
{
	protected _uiSuccessButton: HTMLButtonElement;
	protected _uiSuccessDescription: HTMLSpanElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);

		this._uiSuccessButton = container.querySelector('.order-success__close');
		this._uiSuccessDescription = container.querySelector(
			'.order-success__description'
		);

		this._uiSuccessButton.addEventListener('click', () => {
			events.emit('success:close');
		});
	}

	set totalPrice(value: number) {
		const totalPirceText = `Списано ${value} синапсов`;
		this.setText(this._uiSuccessDescription, totalPirceText);
	}
}

export default SuccessView;
