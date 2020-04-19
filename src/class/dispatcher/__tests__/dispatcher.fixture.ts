export const generatedRequestId = 'generated-request-id';

export const request = {
    method: 'doSomething',
    args: ['request', 'args']
};

export const dispatchCases: any[] = [
    [
        'success',
        {
            requestId: generatedRequestId,
            result: 'response return value'
        },
        async (responsePromise: Promise<string>): Promise<void> => {
            const result = await responsePromise;

            expect(result).toBe('response return value');
        }
    ],
    [
        'error',
        {
            requestId: generatedRequestId,
            error: {
                name: 'Error',
                message: 'Something broke',
                stack: 'stack trace'
            }
        },
        async (responsePromise: Promise<string>): Promise<void> => {
            await expect(responsePromise).rejects.toEqual(expect.any(Error));
            await expect(responsePromise).rejects.toEqual(expect.objectContaining({
                name: 'Error',
                message: 'Something broke',
                stack: 'stack trace'
            }));
        }
    ]
];
