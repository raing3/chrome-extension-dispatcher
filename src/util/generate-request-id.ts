import { nanoid } from 'nanoid';

const requestIdPrefix = nanoid() + '-';
let numRequests = 0;

export const generateRequestId = (): string => {
    return requestIdPrefix + String(numRequests++);
};
