import type { TProduct } from './types';
import PageView from './components/PageView';
import AuctionApi from './components/AuctionApi';
import ModalView from './components/common/Modal';
import SuccessView from './components/SuccessView';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { BasketItemView, BasketModel, BasketView } from './components/Basket';
import {
	ContactsFormView,
	OrderFormView,
	UserDataModel,
} from './components/Forms';
import {
	CatalogItemView,
	CatalogModel,
	CatalogView,
	ProductView,
} from './components/Catalog';

import './scss/styles.scss';

// Инициализация сервисов
const events = new EventEmitter();
const api = new AuctionApi(CDN_URL, API_URL);

// Инициализация темплейтов
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализация контейнеров
const galleryContainer = ensureElement<HTMLDivElement>('.gallery');
const pageWrapper = ensureElement<HTMLDivElement>('.page__wrapper');
const modalContainer = ensureElement<HTMLDivElement>('#modal-container');

// Инициализация моделей
const basketModel = new BasketModel({}, events);
const catalogModel = new CatalogModel({}, events);
const userDataModel = new UserDataModel({}, events);

// Инициализация представителей
const modalView = new ModalView(modalContainer, events);
const productView = new ProductView(cloneTemplate(cardPreviewTemplate), events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const catalogView = new CatalogView(galleryContainer);
const orderFormView = new OrderFormView(cloneTemplate(orderTemplate), events);
const pageView = new PageView(pageWrapper, events);
const successView = new SuccessView(cloneTemplate(successTemplate), events);
const contactsFormView = new ContactsFormView(
	cloneTemplate(contactsTemplate),
	events
);

// Функция рендера корзины
const renderBasket = (data: (string | number)[][]) => {
	basketModel.clearTotalPrice();

	// Устанавливаем значение кол-во товаров в корзине
	pageView.setCounter(data.length);

	basketView.render({
		items: data.map((item) => {
			// Получаем стоимость товара
			const priceProduct = catalogModel.getItem(item[0] as string).price;

			// Записываем кол-во товара в переменную
			const count = item[1] as number;

			// Считаем общую стоимость товара
			const totalPriceProduct = priceProduct * count;
			basketModel.incrementTotalPrice(totalPriceProduct);

			// Создаем представление карточки корзины
			const busketItemView = new BasketItemView(
				cloneTemplate(cardBasketTemplate),
				events
			);

			// Возвращаем готовый HTML элемент
			return busketItemView.render({
				product: catalogModel.getItem(item[0] as string),
				totalCount: item[1] as number,
				totalPrice: totalPriceProduct,
			});
		}),

		// Передаем общую стоимость корзины
		totalPrice: basketModel.getTotalPrice(),
	});
};

/**
 * Установка слушателей событий
 */

// Инициализация каталога товаров
events.on('catalog:init', (event: { items: TProduct[] }) => {
	catalogView.render({
		items: event.items.map((item) => {
			return new CatalogItemView(
				cloneTemplate(cardCatalogTemplate),
				events
			).render({
				category: item.category,
				description: item.description,
				id: item.id,
				image: item.image,
				price: item.price,
				title: item.title,
			});
		}),
	});
});

// Открыли модальное окно
events.on('modal:open', () => {
	pageView.lockPage(true);
});

// Открыли модальное окно корзины товаров
events.on('busket:open', () => {
	modalView.render({
		content: basketView.render({}),
	});
});

// Открыли модальное окно оформления заказа
events.on('order:open', () => {
	modalView.render({
		content: orderFormView.render({}),
	});
});

// Открыли модальное окно превью карточки каталога
events.on('cardPreview:open', (event: { data: TProduct }) => {
	catalogModel.getItem(event.data.id);

	modalView.render({
		content: productView.render({
			product: event.data,
			inBasket: basketModel.inBasket(event.data.id),
		}),
	});
});

// Подтвердили форму оформления заказа
events.on(
	'order:submit',
	(event: { data: { address: string; payment: string } }) => {
		userDataModel.setAddress(event.data.address).setPayment(event.data.payment);

		modalView.render({
			content: contactsFormView.render({}),
		});
	}
);

// Подтвердили форму контактов
events.on(
	'contacts:submit',
	(event: { data: { email: string; phone: string } }) => {
		userDataModel.setEmail(event.data.email).setPhoneNumber(event.data.phone);

		const userData = userDataModel.getUserData();

		api
			.sendOrder({
				payment: userData.paymentMethod,
				email: userData.email,
				phone: userData.phoneNumber,
				address: userData.address,
				total: basketModel.getTotalPrice(),
				items: basketModel.getIds(),
			})
			.then((data) => {
				modalView.render({
					content: successView.render({
						totalPrice: data.total,
					}),
				});

				basketModel.clear();
			})
			.catch((err) => {
				console.error(err);
			});
	}
);

// Добавили товар в корзину
events.on('busket:add', (event: { id: string }) => {
	const price = catalogModel.getItem(event.id).price;

	if (price !== null) {
		basketModel.addItem(event.id);
	}
});

// Удалили товар из корзины
events.on('busket:remove', (event: { id: string }) => {
	basketModel.removeItem(event.id);
});

// Модель корзины была изменена
events.on('busket:changed', (event: { data: (string | number)[][] }) => {
	renderBasket(event.data);
});

// Закрыли модальное окно
events.on('modal:close', () => {
	pageView.lockPage(false);
});

// Закрыли окно успешной оплаты
events.on('success:close', () => {
	modalView.close();
});

// Закрыли превью товара
events.on('productView:close', () => {
	modalView.close();
});

// Запрос католога
api
	.getProductList()
	.then((data) => {
		catalogModel.setItems(data);
	})
	.catch(console.error);
