import { inject as injectAnalytics } from '@vercel/analytics'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import * as rowkit from 'rowkit'
import BevelTiles from './components/BevelTiles.vue'
import ColorList from './components/ColorList.vue'
import ColorPalette from './components/ColorPalette.vue'
import DemoBox from './components/DemoBox.vue'
import SiteLayout from './components/site/SiteLayout.vue'
import NpmVersion from './components/NpmVersion.vue'
import TokenGrid from './components/TokenGrid.vue'
import ThemeBuilder from './components/ThemeBuilder.vue'
import ThemesSideBySide from './components/ThemesSideBySide.vue'
import TypeSamples from './components/TypeSamples.vue'
// The Windows 98 faces, loaded the way an app is told to load them.
import '@fontsource/pt-sans/400.css'
import '@fontsource/pt-sans/700.css'
import '@fontsource/vt323/400.css'
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
  Layout: SiteLayout,
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
    app.component('ColorPalette', ColorPalette)
    app.component('ColorList', ColorList)
    app.component('BevelTiles', BevelTiles)
    app.component('TypeSamples', TypeSamples)
    app.component('TokenGrid', TokenGrid)
    app.component('NpmVersion', NpmVersion)
    app.component('ThemeBuilder', ThemeBuilder)
    app.component('ThemesSideBySide', ThemesSideBySide)

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
