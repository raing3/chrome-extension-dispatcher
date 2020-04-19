import { EventResponder } from '../event-responder';
import { CommunicatorType, ResponderOptions } from '../../../type';
import waitForExpect from 'wait-for-expect';
import { request, requestHandlerCases } from './responder.fixture';

jest.unmock('../event-responder');
jest.unmock('../abstract-responder');

describe('EventResponder', () => {
    const channel = 'eventResponder';
    const requestEventName = 'eventResponder.request';
    const responseEventName = 'eventResponder.response';
    let options: ResponderOptions|null = null;
    let target: any = null;
    let onRequest: Function|null = null;

    beforeEach(() => {
        target = {
            addEventListener: jest.fn((eventName, handler) => {
                onRequest = handler;
            }),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn()
        };

        options = {
            source: {
                type: CommunicatorType.Event,
                channel: channel,
                on: target
            }
        };
    });

    describe('register', () => {
        test('adds an event listener for handling requests', () => {
            const responder = new EventResponder(options!);

            responder.register();

            expect(target.addEventListener).toBeCalledWith(requestEventName, expect.any(Function));
        });

        test.each(requestHandlerCases)('calls handler and sends response back - %s', async (
            description: string,
            extraOptions: Partial<ResponderOptions>,
            expectedResult: any
        ) => {
            const responder = new EventResponder({ ...options, ...extraOptions } as ResponderOptions);

            responder.register();
            onRequest!(new CustomEvent(requestEventName, { detail: request }));

            await waitForExpect(() => expect(target.dispatchEvent).toBeCalled());

            expect(target.dispatchEvent.mock.calls[0][0].type).toBe(responseEventName);
            expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual(expectedResult);
        });
    });

    describe('unregister', () => {
        test('remove the event listener for handling requests', () => {
            const responder = new EventResponder(options!);

            responder.register();
            responder.unregister();

            expect(target.removeEventListener).toBeCalledWith(requestEventName, onRequest);
        });
    });
});
