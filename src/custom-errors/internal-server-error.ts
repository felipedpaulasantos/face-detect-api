import { CustomError } from "./custom-error";

export class InternalServerError extends CustomError {

    constructor(message: string, statusCode: number = 500, err?: Error) {
        
        super(message, "aplicação", statusCode, err);

    }

    // Override CustomError
    toJson(){
        console.error(`=================[ ${new Date().toISOString()} ]=================`);
        console.error(this.originalError.stack);
        console.error(`=================================================================`);
        return {
            error: {
                type: this.type,
                name: this.name,
                message: this.message,
                systemError: {
                    name: this.originalError.name,
                    description: this.originalError.message,
                }
            }
        }
    }
}