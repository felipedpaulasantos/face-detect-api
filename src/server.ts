import express from 'express';
import * as bodyParser from 'body-parser';
import path from 'path';

import { db } from './config';
import { upload } from './middlewares';

import { faceDetectRoutes, personGroupRoutes, personRoutes, errorRoutes } from './routes';

export class Server {

    private readonly app: express.Application;
    private readonly port: number = 3000;
    private db = db;

    constructor() {

        this.app = express(); 
        this.configureMiddlewares();
        this.setGlobals();   
        this.setStaticPaths();
        this.setRoutes();

        this.app.listen(process.env['PORT'] || this.port); 
        console.log(`Servidor escutando na porta ${this.port}`);
    }

    private configureMiddlewares(): void {

        this.app.use(bodyParser.json());

        this.app.use((req: any, res, next) => {
            req.db = this.db;
            next();
        });

        this.app.use((req, res, next) => {
            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            next();
        });
    }

    private setGlobals(): void {
        
        this.app.set('title', 'facedetect');
        this.app.set('version', 'v1');
        this.app.set('secret', 'your secret phrase here');
        this.app.set('upload', upload);
    }

    private setStaticPaths(): void {

        this.app.use(express.static('uploads'));
        this.app.use("/app", express.static(path.join(__dirname, '../../../client/app/')));
        this.app.use("/static", express.static(path.join(__dirname, '../../../client/app/static/')));
        this.app.use("/templates", express.static(path.join(__dirname, '../../../client/app/templates/')));
        this.app.use("/modules", express.static(path.join(__dirname, '../../../client/node_modules/')));
    }

    private setRoutes(): void {

        faceDetectRoutes(this.app);
        personGroupRoutes(this.app);
        personRoutes(this.app);
        errorRoutes(this.app);
    }
}

new Server();