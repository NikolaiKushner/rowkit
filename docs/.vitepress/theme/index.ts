import { inject as injectAnalytics } from '@vercel/analytics'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import * as rowkit from 'rowkit'
import ColorScale from './components/ColorScale.vue'
import DemoBox from './components/DemoBox.vue'
import TokenGrid from './components/TokenGrid.vue'
import './tokens.css'

/**
 * rowkit is registered globally so a markdown page can drop a real component
 * into a demo block without an import in every file.
 *
 * A component library documented with screenshots reads as abandoned. The
 * components on these pages are the ones in the package.
 */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    for (const [name, value] of Object.entries(rowkit)) {
      // Every component export is PascalCase; the composables, the `cn` helper
      // and the cva variant functions are all camelCase. Checking for `render`
      // does not work — a `<script setup>` SFC exposes `setup`/`ssrRender`, not
      // `render`, so the components were silently skipped.
      if (/^[A-Z]/.test(name) && (typeof value === 'object' || typeof value === 'function')) {
        app.component(name, value as never)
      }
    }

    app.component('DemoBox', DemoBox)
    app.component('ColorScale', ColorScale)
    app.component('TokenGrid', TokenGrid)

    /*
     * Vercel Analytics, guarded because `enhanceApp` runs during the static
     * build as well as in the browser. `inject()` writes a `<script>` into
     * `document.head`, so calling it server-side fails the docs build rather
     * than the page — the same shape as the SSR traps the overlay demos hit.
     *
     * Cookieless and without personal data, so it needs no consent banner.
     */
    if (typeof window !== 'undefined') {
      injectAnalytics()
    }
  },
} satisfies Theme
