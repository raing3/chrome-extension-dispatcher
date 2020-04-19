import { AbstractResponder } from './abstract-responder';
import { ResponderOptions, Response } from '../../type';
import Port = chrome.runtime.Port;

export class MessageResponder extends AbstractResponder {
    private port?: Port;

    constructor(options: ResponderOptions) {
        super(options);

        this.handleConnect = this.handleConnect.bind(this);
    }

    public register(): void {
        chrome.runtime.onConnect.addListener(this.handleConnect);
    }

    public unregister(): void {
        chrome.runtime.onConnect.removeListener(this.handleConnect);

        if (this.port) {
            this.port.onMessage.removeListener(this.handleRequest);
            this.port = undefined;
        }
    }

    protected dispatch(response: Response): void {
        this.port!.postMessage(response);
    }

    private handleConnect(port: Port): void {
        if (port.name === this.options.source.channel) {
            this.port = port;
            port.onMessage.addListener(this.handleRequest);
        }
    }
}
