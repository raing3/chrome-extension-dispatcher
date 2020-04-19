import { CommunicatorType, Dispatcher, DispatcherOptions } from '../../type';
import { createDispatcherHandler } from '../create-dispatcher-handler';
import { createDispatcher } from '../create-dispatcher';

jest.unmock('../create-dispatcher');

describe('createDispatcher', () => {
    let options: DispatcherOptions|null = null;
    let dispatcherHandler: Dispatcher|null = null;
    const dispatchResult = Promise.resolve('dispatch result');

    beforeEach(() => {
        options = {
            destination: {
                type: CommunicatorType.Event,
                channel: 'destinationChannel'
            }
        };

        dispatcherHandler = {
            register: jest.fn(),
            unregister: jest.fn(),
            dispatch: jest.fn().mockReturnValue(dispatchResult)
        };

        (createDispatcherHandler as jest.Mock).mockReturnValue(dispatcherHandler);
    });

    test('creates and registers a handler', () => {
        createDispatcher(options!);

        expect(createDispatcherHandler).toBeCalledWith(options);
        expect(dispatcherHandler!.register).toBeCalled();
    });

    test('unregister should call unregister on the handler', () => {
        const dispatcher = createDispatcher(options!);

        dispatcher.unregister();

        expect(dispatcherHandler!.unregister).toBeCalled();
    });

    test('createProxyFunction should return a function which calls dispatch on the handler', () => {
        const dispatcher = createDispatcher(options!);
        const proxy = dispatcher.createProxyFunction('proxyFunction');

        const result = proxy('first argument', 'second argument');

        expect(proxy).toBeInstanceOf(Function);
        expect(result).toBe(dispatchResult);
        expect(dispatcherHandler!.dispatch).toBeCalledWith({
            method: 'proxyFunction',
            args: [
                'first argument',
                'second argument'
            ]
        });
    });
});
