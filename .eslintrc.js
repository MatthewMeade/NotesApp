module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: ['airbnb', 'plugin:react/recommended'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['react'],
    rules: {
        'react/jsx-indent': 0,
        'no-param-reassign': 0,
        'react/no-unstable-nested-components': 0,
        'no-loop-func': 0,
        'no-alert': 0,
        'prefer-destructuring': 0,
        indent: ['error', 4],
        semi: ['error', 'always'],
        'comma-dangle': ['error', 'never'],
        'no-webpack-loader-syntax': 0,
        'no-underscore-dangle': 0,
        'react/jsx-filename-extension': 0,
        'import/prefer-default-export': 0,
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'max-len': ['error', { code: 120 }],
        'no-use-before-define': ['error', { functions: false, classes: false, variables: false }],
        'react/prop-types': 0,
        'react/jsx-indent-props': 0,
        'consistent-return': 0,
        'object-curly-newline': 0,
        'no-restricted-syntax': 0,
        'no-nested-ternary': 0
    },

    settings: {
        react: {
            version: 'detect'
        }
    }
};
