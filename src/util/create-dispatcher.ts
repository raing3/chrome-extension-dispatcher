/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DispatcherOptions } from '../type';
import { createDispatcherHandler } from './create-dispatcher-handler';

export const createDispatcher = (options: DispatcherOptions) => {
    const dispatcher = createDispatcherHandler(options);

    dispatcher.register();

    return {
        unregister: () => dispatcher.unregister(),
        createProxyFunction: <T>(method: string) => {
            return (...args: any[]): Promise<T> => {
                return dispatcher.dispatch<T>({ method, args });
            };
        }
    };
};
