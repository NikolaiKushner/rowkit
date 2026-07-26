import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/*.tsbuildinfo'],
  },

  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  vue.configs['flat/recommended'],

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Vue SFCs: vue-eslint-parser handles <template>, delegating <script> to the
  // TS parser.
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
  },

  // Hard rule 7: no `any`. Escaping the type system is an error, not a warning.
  {
    files: ['**/*.{ts,vue}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // A component library deliberately exports single-word names (Button, Badge,
  // Dialog). The multi-word rule exists to stop app components clashing with
  // HTML elements, which isn't the failure mode here.
  {
    files: ['packages/ui/src/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },

  // Tests may assert on loosely-typed fixtures.
  {
    files: ['**/*.{test,spec}.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },

  // Config files run in Node and aren't part of the shipped surface.
  {
    files: ['*.config.{js,ts}', 'packages/*/*.config.ts'],
    languageOptions: { globals: globals.node },
  },

  // Must stay last so it can switch off stylistic rules Prettier owns.
  prettier
)
