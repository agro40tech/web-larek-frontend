import type { IModel } from '../../types';
import type { IEvents } from './events';

/**
 * Базовая модель, чтобы можно было отличить ее от простых объектов с данными
 */
export abstract class Model implements IModel {
	constructor(protected events: IEvents) {}

	// Сообщить всем что модель поменялась
	public emitChanges(event: string, payload?: object) {
		// Состав данных можно модифицировать
		this.events.emit(event, payload ?? {});
	}
}
