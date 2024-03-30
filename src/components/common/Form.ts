import type { IForm } from '../../types';
import Component from '../base/component';
import type { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// eslint-disable-next-line
export class Form extends Component<{}> implements IForm {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;
	protected _dataSubmit: object;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`, {
				data: this._dataSubmit,
			});
		});
	}

	public set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	public set errors(value: string) {
		this.setText(this._errors, value);
	}

	public set dataSubmit(value: object) {
		this._dataSubmit = value;
	}

	protected _validate = (value: string) => {
		if (value.length !== 0) {
			return true;
		} else {
			return false;
		}
	};
}
