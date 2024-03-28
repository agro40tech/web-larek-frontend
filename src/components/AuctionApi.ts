import { Api } from './base/api';
import type { IAuctionApi, TResponseProductList } from '../types';

class AuctionApi extends Api implements IAuctionApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);

		this.cdn = cdn;
	}

	// Запрос на получения каталога товаров
	public getProductList() {
		return this.get('/product').then((data: TResponseProductList) => {
			return {
				items: data.items.map((item) => ({
					...item,
					image: this.cdn + item.image,
				})),
				total: data.total,
			};
		});
	}

	// TODO: типизировать ответ
	public sendOrder(order: object) {
		return this.post('/order', order).then(
			(data: { id: string; total: number }) => data
		);
	}
}
export default AuctionApi;
