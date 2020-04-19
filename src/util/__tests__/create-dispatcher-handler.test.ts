import { CommunicatorType } from '../../type';
import { EventDispatcher, MessageDispatcher } from '../../class/dispatcher';
import { createDispatcherHandler } from '../create-dispatcher-handler';

jest.unmock('../create-dispatcher-handler');

describe('createDispatcherHandler', () => {
    test.each([
        [CommunicatorType.Event, EventDispatcher],
        [CommunicatorType.Message, MessageDispatcher]
    ])('creates the correct dispatcher type - %s', (type, expectedType) => {
        const dispatcher = createDispatcherHandler({
            destination: {
                type: type,
                channel: 'dispatcherChannel',
                on: 'test'
            }
        });

        expect(dispatcher).toBeInstanceOf(expectedType);
    });

    test('throws error when creating an unknown dispatcher type', () => {
        expect(() => {
            createDispatcherHandler({
                destination: {
                    type: 'unexpected type' as CommunicatorType,
                    channel: 'dispatcherChannel',
                    on: 'test'
                }
            });
        }).toThrow('"unexpected type" is not a valid dispatcher type.');
    });
});
