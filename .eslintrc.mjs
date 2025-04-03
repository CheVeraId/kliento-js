import baseConfig from '@relaycorp/eslint-config';

export default [
    ...baseConfig,
    {
        ignores: ['coverage/**'],
    },
];
