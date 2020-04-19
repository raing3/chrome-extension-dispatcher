import { Request } from './request';

export interface Dispatcher {
    register(): void;
    unregister(): void;
    dispatch<T>(request: Request): Promise<T>;
}
