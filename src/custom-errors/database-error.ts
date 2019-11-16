import { CustomError } from "./custom-error";

export class DatabaseError extends CustomError {

    constructor(message: string, statusCode: number = 400, err?: Error) {
        
        super(message, "banco de dados", statusCode, err);
    }
}