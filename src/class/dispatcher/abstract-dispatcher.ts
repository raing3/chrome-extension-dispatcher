/* eslint-disable no-invalid-this */
import { Dictionary, Dispatcher, DispatcherOptions, PromiseResponder, Request, Response } from '../../type';
import { generateRequestId, logger } from '../../util';

export abstract class AbstractDispatcher implements Dispatcher {
    protected readonly options: DispatcherOptions;

    protected readonly handleResponse = (response: Response): void => {
        const responder = this.promiseResponders[response.requestId];

        delete this.promiseResponders[response.requestId];

        if (response.error) {
            const error = new Error(response.error.message);

            error.name = response.error.name;
            error.stack = response.error.stack;

            logger.log(
                `Source :: channel: ${this.options.destination.channel} (${this.options.destination.type})`,
                'request rejected:',
                response,
                error
            );

            responder.reject(error);
        } else {
            logger.log(
                `Source :: channel: ${this.options.destination.channel} (${this.options.destination.type})`,
                'request resolved:',
                response
            );

            responder.resolve(response.result);
        }
    };

    private readonly promiseResponders: Dictionary<PromiseResponder> = {};

    constructor(options: DispatcherOptions) {
        this.options = options;
    }

    public dispatch<T = any>(request: Request): Promise<T> {
        if (!request.requestId) {
            request.requestId = generateRequestId();
        }

        logger.log(
            `Source :: channel: ${this.options.destination.channel} (${this.options.destination.type})`,
            'dispatching request:',
            request
        );

        return new Promise((resolve, reject) => {
            this.promiseResponders[request.requestId!] = { resolve, reject };

            this.handleRequest(request);
        });
    }

    public abstract register(): void;

    public abstract unregister(): void;

    protected abstract handleRequest(request: Request): void;
}
