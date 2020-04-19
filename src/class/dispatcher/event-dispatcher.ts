import { DispatcherOptions, Request, Response } from '../../type';
import { AbstractDispatcher } from './abstract-dispatcher';

export class EventDispatcher extends AbstractDispatcher {
    private readonly requestEventName: string;

    private readonly responseEventName: string;

    constructor(options: DispatcherOptions) {
        super(options);

        this.requestEventName = `${options.destination.channel}.request`;
        this.responseEventName = `${options.destination.channel}.response`;
        this.handleResponseEvent = this.handleResponseEvent.bind(this);
    }

    public register(): void {
        const target = this.options.destination.on as EventTarget;

        target.addEventListener(this.responseEventName, this.handleResponseEvent);
    }

    public unregister(): void {
        const target = this.options.destination.on as EventTarget;

        target.removeEventListener(this.responseEventName, this.handleResponseEvent);
    }

    protected handleRequest(request: Request): void {
        const target = this.options.destination.on as EventTarget;

        target.dispatchEvent(new CustomEvent(this.requestEventName, { detail: request }));
    }

    private handleResponseEvent(event: Event): void {
        const response = (event as CustomEvent).detail as Response;

        this.handleResponse(response);
    }
}
