import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

/**
 * Two kinds of test run here.
 *
 * `packages/*` are unit and component tests in jsdom — fast, and enough for
 * variant logic and prop wiring.
 *
 * `storybook` turns every story into a real test in a real browser. That is
 * where interaction tests and the accessibility scan live, because neither is
 * meaningful in jsdom: it has no layout, so it cannot tell whether anything is
 * actually visible, focusable, or contrast-compliant.
 */
export default defineConfig({
  test: {
    projects: [
      'packages/*',
      {
        extends: true,
        // The Vue and Tailwind plugins come from .storybook/main.ts's
        // viteFinal, which storybookTest applies. Adding them here as well
        // runs the Vue transform twice, and the second pass fails on the
        // already-compiled output.
        plugins: [
          storybookTest({ configDir: fileURLToPath(new URL('.storybook', import.meta.url)) }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
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
