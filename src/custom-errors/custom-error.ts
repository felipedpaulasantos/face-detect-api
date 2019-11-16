export class CustomError extends Error {

    protected type: string;
    protected status: number;
    protected originalError: Error;

    constructor(friendlyMessage: string, type: string, status: number, err?: Error) {
        
        super(friendlyMessage);
        this.name = this.constructor.name;  
        this.type = type;
        this.status = status;
        this.originalError = err || this;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this.originalError, CustomError);
        }
        
    }

     toJson() {
        console.error(`=================[ ${new Date().toISOString()} ]=================`);
        console.error(this.originalError.stack);
        console.error(`=================================================================`);
        return {
            error: {
                type: this.type,
                name: this.name,
                message: this.message
            }
        }
    } 
}