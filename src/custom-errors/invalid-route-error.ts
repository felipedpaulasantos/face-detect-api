import { CustomError } from "./custom-error";

export class InvalidRouteError extends CustomError {

    constructor(message: string, statusCode: number = 404) {
        
        super(message, "rota", statusCode);

    }
}