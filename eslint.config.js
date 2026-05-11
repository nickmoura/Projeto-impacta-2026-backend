import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],

    extends: [js.configs.recommended],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },

    rules: {
      'no-unused-vars': 'warn',

      'no-useless-catch': 'off',

      'no-undef': 'error',

      'preserve-caught-error': 'off',
    },
  },

  {
    files: ['tests/**/*.js', '**/*.test.js'],

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
]);
