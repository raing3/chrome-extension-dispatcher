import { CommunicatorOptions } from './communicator-options';
import { RequestHandler } from './request-handler';
import { Dictionary } from './dictionary';

export interface ResponderOptions {
    source: CommunicatorOptions;
    onRequest?: RequestHandler;
    handlers?: Dictionary<(...args: any[]) => any>;
}
