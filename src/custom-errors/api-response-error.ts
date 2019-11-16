import { CustomError } from "./custom-error";

export class ApiResponseError extends CustomError {

    constructor(message: string, statusCode: number = 400, err?: Error) {
        
        super(message, "api", statusCode, err);
    }

    toJson() {
        console.error(`=================[ ${new Date().toISOString()} ]=================`);
        console.error(this.originalError.stack);
        console.error(`=================================================================`);
        return {
            error: {
                type: this.type,
                name: this.name,
                message: this.message,
                apiResponse: this.originalError
            }
        }
    } 
}