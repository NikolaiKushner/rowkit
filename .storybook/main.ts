import type { StorybookConfig } from '@storybook/vue3-vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

const config: StorybookConfig = {
  stories: ['../packages/ui/src/**/*.stories.ts'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  core: { disableTelemetry: true },
  /**
   * Two plugins the preview cannot build without.
   *
   * `vue` because the framework preset does not supply it here — without it
   * `.vue` files reach the JS parser raw and the build dies on the first
   * `<script setup>`.
   *
   * `tailwindcss` because Vite inlines an `@import` but does not run Tailwind:
   * the preview would load the token custom properties, generate no utilities
   * at all, and render every component unstyled with no error anywhere.
   */
  viteFinal: (viteConfig) => {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), vue(), tailwindcss()]
    return viteConfig
  },
}

export default config
