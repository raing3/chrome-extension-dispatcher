import { CommunicatorType, Dispatcher, ForwarderOptions, Responder } from '../../type';
import { createDispatcherHandler } from '../create-dispatcher-handler';
import { createResponderHandler } from '../create-responder-handler';
import { createForwarder } from '../create-forwarder';

jest.unmock('../create-forwarder');

describe('createForwarder', () => {
    let options: ForwarderOptions|null = null;
    let dispatcherHandler: Dispatcher|null = null;
    let responderHandler: Responder|null = null;

    beforeEach(() => {
        options = {
            source: {
                type: CommunicatorType.Event,
                channel: 'sourceChannel'
            },
            destination: {
                type: CommunicatorType.Message,
                channel: 'destinationChannel'
            }
        };

        dispatcherHandler = {
            register: jest.fn(),
            unregister: jest.fn(),
            dispatch: jest.fn()
        };

        responderHandler = {
            register: jest.fn(),
            unregister: jest.fn()
        };

        (createDispatcherHandler as jest.Mock).mockReturnValue(dispatcherHandler);
        (createResponderHandler as jest.Mock).mockReturnValue(responderHandler);
    });

    test('creates and registers a dispatcher and responder handler', () => {
        createForwarder(options!);

        expect(createDispatcherHandler).toBeCalledWith({ destination: options!.destination });
        expect(createResponderHandler).toBeCalledWith({
            source: options!.source,
            onRequest: expect.any(Function)
        });

        expect(dispatcherHandler!.register).toBeCalled();
        expect(responderHandler!.register).toBeCalled();
    });

    test('unregister should call unregister on the dispatcher and responder handler', () => {
        const forwarder = createForwarder(options!);

        forwarder.unregister();

        expect(dispatcherHandler!.unregister).toBeCalled();
        expect(responderHandler!.unregister).toBeCalled();
    });

    test('responder should dispatch request to destination', () => {
        createForwarder(options!);

        const onRequest: Function = (createResponderHandler as jest.Mock).mock.calls[0][0].onRequest;
        const request = {
            requestId: 'request-id',
            method: 'sourceMethod',
            args: ['source arguments']
        };

        onRequest(request);

        expect(dispatcherHandler!.dispatch).toBeCalledWith(request);
    });
});
