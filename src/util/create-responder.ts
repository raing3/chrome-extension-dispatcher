/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ResponderOptions } from '../type';
import { createResponderHandler } from './create-responder-handler';

export const createResponder = (options: ResponderOptions) => {
    const responder = createResponderHandler(options);

    responder.register();

    return {
        unregister: () => responder.unregister()
    };
};
