import { CustomError } from "./custom-error";

export class FileError extends CustomError {

    constructor(message: string, statusCode: number = 400, err?: Error) {
        
        super(message, "arquivo", statusCode, err);
    }
}