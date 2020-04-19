const log = (...args: any[]): void => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('chrome-extension-dispatcher', ...args); // eslint-disable-line no-console
    }
};

const error = (...args: any[]): void => {
    if (process.env.NODE_ENV !== 'production') {
        console.error('chrome-extension-dispatcher', ...args); // eslint-disable-line no-console
    }
};

export const logger = { log, error };
