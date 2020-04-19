import { MessageResponder } from '../message-responder';
import { CommunicatorType, ResponderOptions } from '../../../type';
import waitForExpect from 'wait-for-expect';
import { request, requestHandlerCases } from './responder.fixture';

jest.unmock('../message-responder');
jest.unmock('../abstract-responder');

describe('MessageResponder', () => {
    const channel = 'messageResponder';
    let options: ResponderOptions|null = null;
    let onConnect: Function|null = null;
    let onMessage: Function|null = null;
    let port: any = null;

    beforeEach(() => {
        options = {
            source: {
                type: CommunicatorType.Message,
                channel: channel
            }
        };

        port = {
            name: channel,
            onMessage: {
                addListener: jest.fn((handler) => {
                    onMessage = handler;
                }),
                removeListener: jest.fn()
            },
            postMessage: jest.fn()
        };

        (global as any).chrome = {
            runtime: {
                onConnect: {
                    addListener: jest.fn((handler) => {
                        onConnect = handler;
                    }),
                    removeListener: jest.fn()
                }
            }
        };
    });

    describe('register', () => {
        test('does not register handler when a connection is made with a different port name to the channel', () => {
            const responder = new MessageResponder(options!);

            responder.register();
            onConnect!({ ...port, name: 'unexpectedPortName' });

            // onConnect and onMessage listeners should be added
            expect(chrome.runtime.onConnect.addListener).toBeCalledWith(expect.any(Function));
            expect(port.onMessage.addListener).not.toBeCalled();
        });

        test.each(requestHandlerCases)('calls handler and sends response back - %s', async (
            description: string,
            extraOptions: Partial<ResponderOptions>,
            expectedResult: any
        ) => {
            const responder = new MessageResponder({ ...options, ...extraOptions } as ResponderOptions);

            responder.register();
            onConnect!(port);
            onMessage!(request);

            // onConnect and onMessage listeners should be added
            expect(chrome.runtime.onConnect.addListener).toBeCalledWith(expect.any(Function));
            expect(port.onMessage.addListener).toBeCalledWith(expect.any(Function));

            await waitForExpect(() => expect(port.postMessage).toBeCalled());

            expect(port.postMessage).toBeCalledWith(expectedResult);
        });
    });

    describe('unregister', () => {
        test('remove onConnect handler', () => {
            const responder = new MessageResponder(options!);

            responder.register();
            responder.unregister();

            // onConnect listener should be removed
            expect(chrome.runtime.onConnect.removeListener).toBeCalledWith(onConnect);
            expect(port.onMessage.removeListener).not.toBeCalled();
        });

        test('remove onMessage handler if a connection is active', () => {
            const responder = new MessageResponder(options!);

            responder.register();
            onConnect!(port);
            responder.unregister();

            // onConnect listener should be removed
            expect(chrome.runtime.onConnect.removeListener).toBeCalledWith(onConnect);
            expect(port.onMessage.removeListener).toBeCalledWith(onMessage);
        });
    });
});
