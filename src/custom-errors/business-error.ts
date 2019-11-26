import { CustomError } from './custom-error';

export class BusinessError extends CustomError {

	constructor(message: string, statusCode: number = 422, err?: Error) {

		super(message, 'regra de negócio', statusCode, err);
	}
}
