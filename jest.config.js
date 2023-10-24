/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    passWithNoTests: true,
    collectCoverage: true,
    testMatch: ['**/__tests__/**/*.test.[jt]s?(x)']
}
