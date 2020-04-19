/* eslint-disable no-console */
import { logger } from '../logger';

jest.unmock('../logger');

describe('log', () => {
    beforeEach(() => {
        // jest.spyOn(console, 'log');
        global.console.log = jest.fn();
    });

    test('calls console.log if environment is not production', () => {
        process.env.NODE_ENV = 'development';

        logger.log('log', 'message');

        expect(console.log).toBeCalledWith('chrome-extension-dispatcher', 'log', 'message');
    });

    test('does not call console.log if environment is production', () => {
        process.env.NODE_ENV = 'production';

        logger.log('log', 'message');

        expect(console.log).not.toBeCalled();
    });
});

describe('error', () => {
    beforeEach(() => {
        // jest.spyOn(console, 'error');
        global.console.error = jest.fn();
    });

    test('calls console.error if environment is not production', () => {
        process.env.NODE_ENV = 'development';

        logger.error('error', 'message');

        expect(console.error).toBeCalledWith('chrome-extension-dispatcher', 'error', 'message');
    });

    test('does not call console.error if environment is production', () => {
        process.env.NODE_ENV = 'production';

        logger.error('error', 'message');

        expect(console.error).not.toBeCalled();
    });
});
