import { CommunicatorType, Dispatcher, DispatcherOptions } from '../type';
import { EventDispatcher, MessageDispatcher } from '../class/dispatcher';

export const createDispatcherHandler = (options: DispatcherOptions): Dispatcher => {
    switch (options.destination.type) {
        case CommunicatorType.Event:
            return new EventDispatcher(options);
        case CommunicatorType.Message:
            return new MessageDispatcher(options);
    }

    throw new Error(`"${options.destination.type}" is not a valid dispatcher type.`);
};
