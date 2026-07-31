import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import * as rowkit from 'rowkit'
import DemoBox from './components/DemoBox.vue'
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
  },
} satisfies Theme
