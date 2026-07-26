import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['packages/*/src/**/*.{ts,vue}'],
      exclude: ['**/*.{test,spec}.ts', '**/*.stories.ts', '**/index.ts'],
      // Plan targets 80% on the ui package. Don't chase 100%.
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
