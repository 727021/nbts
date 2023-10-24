module.exports = {
    env: {
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'prettier'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json', './tsconfig.eslint.json', './tsconfig.jest.json']
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'no-console': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn'
    },
    ignorePatterns: ['nano-staged.mjs', 'rollup.config.js', 'jest.config.js']
}
