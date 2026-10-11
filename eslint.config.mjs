import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import packageJson from 'eslint-plugin-package-json';
import prettier from 'eslint-config-prettier';

export default defineConfig(
  {
    files: ['package.json'],
    extends: [packageJson.configs.recommended],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './src/tsconfig.json',
      },
    },
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked, prettier],
  },
  {
    files: ['test/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './test/tsconfig.json',
      },
    },
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked, prettier],
  },
);
