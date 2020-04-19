const nanoid = jest.fn(() => 'randomRequestIdPrefix');

jest.unmock('../generate-request-id');
jest.mock('nanoid', () => ({ nanoid }));

import { generateRequestId } from '../generate-request-id';

describe('generateRequestId', () => {
    test('returns a different string every time', () => {
        const firstRequestId = generateRequestId();
        const secondRequestId = generateRequestId();

        expect(firstRequestId).toBe('randomRequestIdPrefix-0');
        expect(secondRequestId).toBe('randomRequestIdPrefix-1');
    });
});
