import { CommunicatorType, Responder, ResponderOptions } from '../type';
import { EventResponder, MessageResponder } from '../class/responder';

export const createResponderHandler = (options: ResponderOptions): Responder => {
    switch (options.source.type) {
        case CommunicatorType.Event:
            return new EventResponder(options);
        case CommunicatorType.Message:
            return new MessageResponder(options);
    }

    throw new Error(`"${options.source.type}" is not a valid responder type.`);
};
