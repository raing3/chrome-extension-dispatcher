import { AbstractDispatcher } from './abstract-dispatcher';
import { Request } from '../../type';
import Port = chrome.runtime.Port;

export class MessageDispatcher extends AbstractDispatcher {
    private port?: Port;

    public register(): void {
        this.port = chrome.runtime.connect({ name: this.options.destination.channel });
        this.port!.onMessage.addListener(this.handleResponse);
    }

    public unregister(): void {
        this.port!.onMessage.removeListener(this.handleResponse);
        this.port!.disconnect();
        this.port = undefined;
    }

    protected handleRequest(request: Request): void {
        this.port!.postMessage(request);
    }
}
