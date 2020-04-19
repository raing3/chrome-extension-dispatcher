import { CommunicatorOptions } from './communicator-options';

export interface ForwarderOptions {
    source: CommunicatorOptions;
    destination: CommunicatorOptions;
}
