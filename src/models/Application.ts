import { Application } from 'express';
import RequestInterface from './server/RequestInterface';

export default interface ExpressApplication extends Application {
    ws: (url: string, callback: (ws: any, req: RequestInterface) => void) => void;
}
