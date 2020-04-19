import { EventDispatcher } from '../event-dispatcher';
import { CommunicatorType, DispatcherOptions } from '../../../type';
import { generatedRequestId, request, dispatchCases } from './dispatcher.fixture';
import { generateRequestId } from '../../../util';

jest.unmock('../event-dispatcher');
jest.unmock('../abstract-dispatcher');

describe('EventDispatcher', () => {
    const channel = 'eventDispatcher';
    const requestEventName = 'eventDispatcher.request';
    const responseEventName = 'eventDispatcher.response';
    let options: DispatcherOptions|null = null;
    let target: any = null;
    let onResponse: Function|null = null;

    beforeEach(() => {
        target = {
            addEventListener: jest.fn((eventName, handler) => {
                onResponse = handler;
            }),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn()
        };

        options = {
            destination: {
                type: CommunicatorType.Event,
                channel: channel,
                on: target
            }
        };

        (generateRequestId as jest.Mock).mockReturnValue(generatedRequestId);
    });

    describe('register', () => {
        test('adds an event listener for handling responses', () => {
            const dispatcher = new EventDispatcher(options!);

            dispatcher.register();

            expect(target.addEventListener).toBeCalledWith(responseEventName, expect.any(Function));
        });
    });

    describe('unregister', () => {
        test('remove the event listener for handling responses', () => {
            const dispatcher = new EventDispatcher(options!);

            dispatcher.register();
            dispatcher.unregister();

            expect(target.removeEventListener).toBeCalledWith(responseEventName, onResponse);
        });
    });

    describe('dispatch', () => {
        test.each(dispatchCases)('dispatches request event and handles response event - %s', async (
            description: string,
            response: Response,
            validateResponse: Function
        ) => {
            const dispatcher = new EventDispatcher(options!);

            dispatcher.register();

            const responsePromise = dispatcher.dispatch(request);

            // should dispatch request event
            expect(target.dispatchEvent).toBeCalledWith(expect.any(CustomEvent));
            expect(target.dispatchEvent.mock.calls[0][0].type).toBe(requestEventName);
            expect(target.dispatchEvent.mock.calls[0][0].detail).toEqual({
                requestId: generatedRequestId,
                method: request.method,
                args: request.args
            });

            // simulate response event
            onResponse!(new CustomEvent(responseEventName, { detail: response }));

            await validateResponse(responsePromise);
        });
    });
});
