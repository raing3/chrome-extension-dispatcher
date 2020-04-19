import { Request, ResponderOptions, Response } from '../../type';
import { AbstractResponder } from './abstract-responder';

export class EventResponder extends AbstractResponder {
    private readonly requestEventName: string;

    private readonly responseEventName: string;

    constructor(options: ResponderOptions) {
        super(options);

        this.requestEventName = `${options.source.channel}.request`;
        this.responseEventName = `${options.source.channel}.response`;
        this.handleRequestEvent = this.handleRequestEvent.bind(this);
    }

    register(): void {
        const target = this.options.source.on as EventTarget;

        target.addEventListener(this.requestEventName, this.handleRequestEvent);
    }

    unregister(): void {
        const target = this.options.source.on as EventTarget;

        target.removeEventListener(this.requestEventName, this.handleRequestEvent);
    }

    protected dispatch(response: Response): void {
        const target = this.options.source.on as EventTarget;

        target.dispatchEvent(new CustomEvent(this.responseEventName, {
            detail: response
        }));
    }

    private handleRequestEvent(event: Event): Promise<void> {
        const request = (event as CustomEvent).detail as Request;

        return this.handleRequest(request);
    }
}
