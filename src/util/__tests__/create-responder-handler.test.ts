import { CommunicatorType } from '../../type';
import { createResponderHandler } from '../create-responder-handler';
import { EventResponder, MessageResponder } from '../../class/responder';

jest.unmock('../create-responder-handler');

describe('createResponderHandler', () => {
    test.each([
        [CommunicatorType.Event, EventResponder],
        [CommunicatorType.Message, MessageResponder]
    ])('creates the correct responder type - %s', (type, expectedType) => {
        const responder = createResponderHandler({
            source: {
                type: type,
                channel: 'responderChannel',
                on: 'test'
            },
            onRequest: jest.fn()
        });

        expect(responder).toBeInstanceOf(expectedType);
    });

    test('throws error when creating an unknown responder type', () => {
        expect(() => {
            createResponderHandler({
                source: {
                    type: 'unexpected type' as CommunicatorType,
                    channel: 'responderChannel',
                    on: 'test'
                },
                onRequest: jest.fn()
            });
        }).toThrow('"unexpected type" is not a valid responder type.');
    });
});
