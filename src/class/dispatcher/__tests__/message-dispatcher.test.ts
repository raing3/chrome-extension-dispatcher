import { MessageDispatcher } from '../message-dispatcher';
import { CommunicatorType, DispatcherOptions } from '../../../type';
import { generatedRequestId, request, dispatchCases } from './dispatcher.fixture';
import { generateRequestId } from '../../../util';

jest.unmock('../message-dispatcher');
jest.unmock('../abstract-dispatcher');

describe('MessageDispatcher', () => {
    const channel = 'messageDispatcher';
    let options: DispatcherOptions|null = null;
    let port: any = null;
    let onResponse: Function|null = null;

    beforeEach(() => {
        options = {
            destination: {
                type: CommunicatorType.Event,
                channel: channel
            }
        };

        port = {
            name: channel,
            onMessage: {
                addListener: jest.fn((handler) => {
                    onResponse = handler;
                }),
                removeListener: jest.fn()
            },
            postMessage: jest.fn(),
            disconnect: jest.fn()
        };

        (generateRequestId as jest.Mock).mockReturnValue(generatedRequestId);
        (global as any).chrome = {
            runtime: {
                connect: jest.fn().mockReturnValue(port)
            }
        };
    });

    describe('register', () => {
        test('creates a port and adds an event listener', () => {
            const dispatcher = new MessageDispatcher(options!);

            dispatcher.register();

            expect(chrome.runtime.connect).toBeCalledWith({ name: channel });
            expect(port.onMessage.addListener).toBeCalledWith(expect.any(Function));
        });
    });

    describe('unregister', () => {
        test('remove the event listener for handling responses', () => {
            const dispatcher = new MessageDispatcher(options!);

            dispatcher.register();
            dispatcher.unregister();

            expect(port.onMessage.removeListener).toBeCalledWith(onResponse);
            expect(port.disconnect).toBeCalled();
        });
    });

    describe('dispatch', () => {
        test.each(dispatchCases)('dispatches request event and handles response event', async (
            description: string,
            response: Response,
            validateResponse: Function
        ) => {
            const dispatcher = new MessageDispatcher(options!);

            dispatcher.register();

            const responsePromise = dispatcher.dispatch(request);

            // should dispatch request
            expect(port.postMessage).toBeCalledWith({
                requestId: generatedRequestId,
                method: request.method,
                args: request.args
            });

            // simulate response message
            onResponse!(response);

            await validateResponse(responsePromise);
        });
    });
});
