module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    automock: true,
    resetModules: true,
    clearMocks: true,
    timers: 'fake',
    collectCoverage: true,
    coverageDirectory: '../build/coverage',
    unmockedModulePathPatterns: [
        'tslib',
        'wait-for-expect',
        '\.fixture\.ts'
    ],
    testMatch: [
        '**/__tests__/**/*.test.ts'
    ],
    setupFilesAfterEnv: [
        './jest.setup.js'
    ]
};