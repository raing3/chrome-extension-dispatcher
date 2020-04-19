import { createResponder } from '../create-responder';
import { CommunicatorType, Responder, ResponderOptions } from '../../type';
import { createResponderHandler } from '../create-responder-handler';

jest.unmock('../create-responder');

describe('createResponder', () => {
    let options: ResponderOptions|null = null;
    let responderHandler: Responder|null = null;

    beforeEach(() => {
        options = {
            source: {
                type: CommunicatorType.Event,
                channel: 'sourceChannel'
            },
            onRequest: jest.fn()
        };

        responderHandler = {
            register: jest.fn(),
            unregister: jest.fn()
        };

        (createResponderHandler as jest.Mock).mockReturnValue(responderHandler);
    });

    test('creates and registers a handler', () => {
        createResponder(options!);

        expect(createResponderHandler).toBeCalledWith(options);
        expect(responderHandler!.register).toBeCalled();
    });

    test('unregister should call unregister on the handler', () => {
        const responder = createResponder(options!);

        responder.unregister();

        expect(responderHandler!.unregister).toBeCalled();
    });
});
