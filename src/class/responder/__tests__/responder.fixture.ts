import { Request } from '../../../type';

export const request: Request = {
    requestId: 'request-id',
    method: 'doSomething',
    args: ['request', 'args']
};

export const requestHandlerCases: any[] = [
    [
        'handler',
        {
            handlers: {
                doSomething: jest.fn((...args) => {
                    return Promise.resolve(['responding to', ...args]);
                })
            }
        },
        {
            requestId: 'request-id',
            result: ['responding to', 'request', 'args']
        }
    ],
    [
        'onRequest',
        {
            onRequest: jest.fn(req => {
                return Promise.resolve(`responding to ${req.requestId}`);
            })
        },
        {
            requestId: 'request-id',
            result: 'responding to request-id'
        }
    ],
    [
        'response object returned from handler',
        {
            onRequest: jest.fn(req => {
                return Promise.resolve({
                    requestId: 'request-id',
                    result: `responding to ${req.requestId}`
                });
            })
        },
        {
            requestId: 'request-id',
            result: 'responding to request-id'
        }
    ],
    [
        'nothing returned from handler',
        {
            onRequest: jest.fn(() => Promise.resolve(null))
        },
        {
            requestId: 'request-id',
            result: null
        }
    ],
    [
        'handler/onRequest not provided',
        {},
        {
            requestId: 'request-id',
            error: {
                message: expect.stringContaining('a handler for "doSomething" has not been defined'),
                name: 'Error',
                stack: expect.any(String)
            }
        }
    ]
];
