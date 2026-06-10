import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const importOrderRules = [
  'warn',
  {
    groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object', 'type'],
    pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
    'newlines-between': 'always',
    alphabetize: { order: 'asc', caseInsensitive: true },
  },
]

const reactRules = {
  ...react.configs.recommended.rules,
  'react/react-in-jsx-scope': 'off',
  'react/jsx-key': 'error',
  'react/no-unstable-nested-components': [
    'warn',
    {
      allowAsProps: true,
    },
  ],
  'import/order': importOrderRules,
}

export default defineConfig([
  globalIgnores(['dist/**', 'build/**', 'node_modules/**']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    plugins: { react, import: importPlugin },
    rules: {
      ...reactRules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    plugins: { react, import: importPlugin },
    rules: reactRules,
  },
])
