import js from '@eslint/js';
import i18next from 'eslint-plugin-i18next';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

const feature = (name) => ({
  files: [`src/features/${name}/**/*.{ts,tsx}`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            regex: `^@/features/(?!${name}/)`,
            message: 'A feature never imports another feature (architecture overview).',
          },
          { regex: '^@/app/', message: 'Features never import routes.' },
        ],
      },
    ],
  },
});

export default defineConfig(
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'dist-web/**',
      'android/**',
      'expo-env.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  { files: ['**/*.js', '**/*.mjs'], ...tseslint.configs.disableTypeChecked },
  {
    files: ['babel.config.js'],
    languageOptions: { sourceType: 'commonjs', globals: { module: 'writable' } },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: { globals: { process: 'readonly', console: 'readonly' } },
    rules: { 'no-console': 'off' },
  },
  {
    ignores: ['scripts/**'],
    rules: {
      'no-console': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  { files: ['src/**/*.{ts,tsx}'], extends: [reactHooks.configs.flat['recommended-latest']] },
  {
    files: ['src/**/*.tsx'],
    ignores: ['**/*.test.tsx'],
    plugins: { i18next },
    rules: { 'i18next/no-literal-string': ['error', { mode: 'jsx-text-only' }] },
  },
  {
    // core is pure TypeScript: it imports nothing from the app (architecture overview).
    files: ['src/core/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [{ regex: '^[^.]', message: 'core imports nothing outside itself.' }] },
      ],
    },
  },
  feature('home'),
  feature('course-screen'),
  feature('grade-editor'),
);
