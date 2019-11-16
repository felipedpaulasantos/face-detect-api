import { NextFunction, Request, Response } from "express-serve-static-core";
import { InternalServerError, InvalidRouteError } from "../custom-errors";

export function errorRoutes(app: any): void {

    app.use('*', (request: Request, response: Response) => {
        response.status(404).json(
            new InvalidRouteError(`Rota ${request.originalUrl} não existe!`).toJson()
        );
    });

    app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
        response.status(500).json(
            new InternalServerError(`Ocorreu um erro interno na aplicação. Consulte o administrador.`, 500, err).toJson()
        );
    });
}