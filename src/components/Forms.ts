import { Form } from './common/Form';
import { Model } from './base/model';
import type { IEvents } from './base/events';
import type { IUserDataModel } from '../types';

// Модель данных пользователя
// eslint-disable-next-line
class UserDataModel extends Model<{}> implements IUserDataModel {
	protected _address: string;
	protected _email: string;
	protected _paymentMethod: string;
	protected _phoneNumber: string;

	constructor(protected data: object, events: IEvents) {
		super(data, events);
	}

	public setAddress = (address: string) => {
		this._address = address;
		return this;
	};

	public setEmail = (email: string) => {
		this._email = email;
		return this;
	};

	public setPayment = (method: string) => {
		this._paymentMethod = method;
		return this;
	};

	public setPhoneNumber = (number: string) => {
		this._phoneNumber = number;
		return this;
	};

	// Возвращает объект данных пользователя
	public getUserData = () => {
		return {
			address: this._address,
			email: this._email,
			paymentMethod: this._paymentMethod,
			phoneNumber: this._phoneNumber,
		};
	};
}

// Представление формы оформления заказа
class OrderFormView extends Form {
	protected _uiPaymentButtons: HTMLButtonElement[];
	protected _uiFormInput: HTMLInputElement;

	protected _address = '';
	protected _paymentMethod = '';

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);

		// Получаем ui элементы кнопок выбора метода платежа
		this._uiPaymentButtons = Array.from(
			container.querySelectorAll('.button_alt')
		);

		this._uiFormInput = container.querySelector('.form__input');

		// Устанавливаем слушатели нажатия на кнопи выбора метода оплаты
		this._uiPaymentButtons.map((button) => {
			button.addEventListener('click', () => {
				this._paymentMethod = button.name;
				this._changed();
			});
		});

		// Устанавливаем слушателя на поле адреса проживания
		this._uiFormInput.addEventListener('input', () => {
			this._address = this._uiFormInput.value;
			this._changed();
		});
	}

	// Валидация адреса
	protected _validateAddress = () => {
		if (this._validate(this._address)) {
			return true;
		} else {
			return false;
		}
	};

	// Валидация метода оплаты
	protected _validatePaymentMethod = () => {
		if (this._validate(this._paymentMethod)) {
			return true;
		} else {
			return false;
		}
	};

	// Вызов общей валидации формы
	protected _changed = () => {
		if (this._validateAddress() && this._validatePaymentMethod()) {
			this.valid = true;
			this.errors = '';
			this.dataSubmit = {
				address: this._address,
				payment: this._paymentMethod,
			};
		} else {
			this.valid = false;
			this.errors = 'Все поля должны быть заполнены!';
		}
	};
}

// Представление формы контактов
class ContactsFormView extends Form {
	protected _uiEmailInput: HTMLInputElement;
	protected _uiPhoneNumberInput: HTMLInputElement;

	protected _email = '';
	protected _phoneNumber = '';
	protected _errorMessage: string;

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);

		// Получаем ui элемент инпут поля email
		this._uiEmailInput = container.elements.namedItem(
			'email'
		) as HTMLInputElement;

		// Получаем ui элемент инпут поля номера телефона
		this._uiPhoneNumberInput = container.elements.namedItem(
			'phone'
		) as HTMLInputElement;

		// Устанавливаем слушатели события
		this._uiEmailInput.addEventListener('input', () => {
			this._email = this._uiEmailInput.value;
			this._changed();
		});

		this._uiPhoneNumberInput.addEventListener('input', () => {
			this._phoneNumber = this._uiPhoneNumberInput.value;
			this._changed();
		});
	}

	// Валидация email
	protected _validateEmail = () => {
		const validateEmailRegex = /^\S+@\S+\.\S+$/;

		if (this._validate(this._email)) {
			if (validateEmailRegex.test(this._email)) {
				this.errors = '';
				return true;
			} else {
				this.valid = false;
				this.errors = 'Должен быть введен email адрес!';
			}
		} else {
			this.errors = 'Все поля должны быть заполнены!';
			return false;
		}
	};

	// Валидация номера телефона
	protected _validatePhoneNumber = () => {
		const validatePhoneRegex = /^\+\d{11}$/;

		if (this._validate(this._phoneNumber)) {
			if (validatePhoneRegex.test(this._phoneNumber)) {
				this.errors = '';
				return true;
			} else {
				this.valid = false;
				this.errors = 'Должен быть введен номер телефона (+71234567890)!';
			}
		} else {
			this.errors = 'Все поля должны быть заполнены!';
			return false;
		}
	};

	protected _changed = () => {
		if (this._validateEmail() && this._validatePhoneNumber()) {
			this.valid = true;
			this.dataSubmit = {
				email: this._email,
				phone: this._phoneNumber,
			};
		} else {
			this.valid = false;
		}
	};
}

export { OrderFormView, ContactsFormView, UserDataModel };
