// eslint.config.js
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        files: ['src/**/*.{jsx,ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                project: './tsconfig.json',
            },
            globals: {
                window: "readonly",
                document: "readonly"
            },
        },
        plugins: {
            react,
            prettier,
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tsPlugin.configs.recommended.rules,
            'prettier/prettier': ['error', { singleQuote: false }],
            'react/react-in-jsx-scope': 'off',
            'quotes': ['error', 'double', { avoidEscape: true }],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];
