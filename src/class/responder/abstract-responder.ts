/* eslint-disable no-invalid-this */
import { Request, Responder, ResponderOptions, Response } from '../../type';
import { logger } from '../../util';

export abstract class AbstractResponder implements Responder {
    protected readonly options: ResponderOptions;

    protected readonly handleRequest = async (request: Request): Promise<void> => {
        try {
            let response: Response|null = null;
            let isHandled = false;

            if (this.options.handlers && request.method in this.options.handlers) {
                response = await this.options.handlers[request.method](...request.args);
                isHandled = true;
            } else if (this.options.onRequest) {
                response = await this.options.onRequest!(request);
                isHandled = true;
            }

            if (!isHandled) {
                throw new Error(
                    `Cannot respond to request "${request.requestId}", a handler for ` +
                    `"${request.method}" has not been defined.`
                );
            }

            // transform the response to a response object if it isn't already
            if (!response?.requestId) {
                response = {
                    requestId: request.requestId!,
                    result: response
                };
            }

            logger.log(
                `Destination :: channel: ${this.options.source.channel} (${this.options.source.type})`,
                'response resolved: ',
                response
            );

            this.dispatch(response!);
        } catch (error) {
            const response = {
                requestId: request.requestId!,
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                }
            };

            logger.error(
                `Destination :: channel: ${this.options.source.channel} (${this.options.source.type})`,
                'response rejected: ',
                response,
                error
            );

            this.dispatch(response);
        }
    };

    constructor(options: ResponderOptions) {
        this.options = options;
    }

    public abstract register(): void;

    public abstract unregister(): void;

    protected abstract dispatch(response: Response): void;
}
