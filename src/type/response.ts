export interface Response {
    requestId: string;
    result?: any;
    error?: {
        name: string;
        message: string;
        stack: string;
    };
}
