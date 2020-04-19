/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ForwarderOptions, Request } from '../type';
import { createDispatcherHandler } from './create-dispatcher-handler';
import { createResponderHandler } from './create-responder-handler';

export const createForwarder = (options: ForwarderOptions) => {
    const dispatcher = createDispatcherHandler({ destination: options.destination });
    const responder = createResponderHandler({
        source: options.source,
        onRequest: (request: Request) => {
            return dispatcher.dispatch(request);
        }
    });

    dispatcher.register();
    responder.register();

    return {
        unregister: () => {
            dispatcher.unregister();
            responder.unregister();
        }
    };
};
