import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/*.tsbuildinfo',
      // Nuxt and Storybook build output.
      'playground/.nuxt/**',
      'playground/.output/**',
      'storybook-static/**',
    ],
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
      // Optional props are typed `foo?: T`, and `exactOptionalPropertyTypes`
      // rejects an explicit `undefined` default — so the default this rule
      // asks for cannot be written.
      'vue/require-default-prop': 'off',
    },
  },

  // Tests and stories import .vue files, which typescript-eslint's program
  // cannot type without the Vue language plugin — every such import lands as an
  // error type and trips the unsafe-* rules. `pnpm typecheck` runs vue-tsc,
  // which does understand them, so the type safety is not actually lost here.
  {
    files: ['**/*.{test,spec}.ts', '**/*.stories.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      // Test fixtures are throwaway wrappers, not shipped components.
      'vue/one-component-per-file': 'off',
      'vue/no-reserved-component-names': 'off',
    },
  },

  // Build scripts are plain ESM run by Node, outside any tsconfig project, so
  // type-aware rules have no program to consult.
  {
    files: ['**/scripts/**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      globals: globals.node,
      parserOptions: { projectService: false },
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
