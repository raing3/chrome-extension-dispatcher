import { CommunicatorType } from './communicator-type';

export interface CommunicatorOptions {
    type: CommunicatorType;
    channel: string;
    on?: any;
}
