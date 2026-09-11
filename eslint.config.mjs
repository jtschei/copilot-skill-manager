import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import packageJson from 'eslint-plugin-package-json';

export default defineConfig(
    {
        files: ['package.json'],
        extends: [packageJson.configs.recommended],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.src.json',
            },
        },
        extends: [
            js.configs.recommended,
            tseslint.configs.recommendedTypeChecked,
            tseslint.configs.stylisticTypeChecked,
        ],
        rules: {
            'lines-between-class-members': ['error', 'always'],
        },
    },
);
