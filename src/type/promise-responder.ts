export interface PromiseResponder<T = any> {
    resolve: (value: T) => void;
    reject: (value: T) => void;
}
