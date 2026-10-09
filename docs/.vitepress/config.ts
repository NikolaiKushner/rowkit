import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type UserConfig } from 'vitepress'
import { describe, pageHead, sharedHead } from './social'
import { tables } from './tables'
import { themeBootScript } from './theme/components/site/useSiteTheme'

/**
 * A plugin as VitePress's own Vite takes it. `@tailwindcss/vite` is typed
 * against this repository's Vite 8, while VitePress 1 runs its bundled Vite 5:
 * the plugin works on either, but the two `Plugin` types are distinct, so it
 * is named in VitePress's terms here rather than left to a type error.
 */
type VitePressPlugin = NonNullable<NonNullable<UserConfig['vite']>['plugins']>[number]

/**
 * rowkit.dev 2.0 (design/briefs/site.md): the docs are VitePress's default
 * theme with the brand on it, light and dark; the live examples are drawn in
 * the rowkit theme the nav bar's «Components» switch picks.
 */
export default defineConfig({
  title: 'rowkit',
  titleTemplate: ':title — rowkit',
  description: 'A professional Vue 3 toolkit — the components a product interface is built from.',
  lang: 'en-GB',
  cleanUrls: true,
  lastUpdated: true,

  // Callout titles as the Figma panels read: «Tip», not «TIP».
  markdown: {
    /*
     * GitHub's colours, in the variants whose every token clears 4.5:1 on
     * VitePress's code block: the plain github-light has red, green and orange
     * at 3.2–4.3:1 on #f6f6f7, and github-dark's comments are 3.8:1.
     */
    theme: { light: 'github-light-high-contrast', dark: 'github-dark-default' },
    container: {
      tipLabel: 'Tip',
      infoLabel: 'Note',
      warningLabel: 'Warning',
      dangerLabel: 'Danger',
      detailsLabel: 'Details',
    },
    config: (md) => md.use(tables),
  },

  sitemap: { hostname: 'https://rowkit.dev' },

  // Link previews: a description from each page's first paragraph, and the
  // page's own title, description and URL in its card.
  transformPageData(pageData, { siteConfig }) {
    describe(pageData, siteConfig.srcDir)
  },
  transformHead: pageHead,

  /*
   * Vite inlines an `@import` but does not run Tailwind, so without this the
   * site loads the token custom properties, generates no utilities at all, and
   * renders every demo unstyled with no error anywhere — the same trap the
   * Storybook setup hit.
   *
   * VitePress ships an *unlayered* form/table reset. Tailwind v4 utilities live
   * in `@layer utilities`, so the reset always won and demos lost padding,
   * borders and header chrome. `all: revert-layer` papered over it in Chrome
   * but is unreliable in Safari (WebKit cascade-layer bugs). Wrapping VitePress
   * CSS in `@layer vp-theme` puts the reset below utilities — the correct fix,
   * and Safari-safe.
   *
   * The order statement has to ride along on every wrapped file rather than
   * live in `theme/tokens.css`. Without an explicit statement the browser
   * orders layers by first appearance, and this plugin's output lands at the
   * very top of the bundle — so `vp-theme` became the *lowest* layer, below
   * Tailwind's `base`. Preflight resets `h1`–`h6` to `font-size: inherit`, and
   * a layer beats specificity, so every heading on every docs page collapsed to
   * body size. Naming the order here puts `vp-theme` above `base` (headings
   * survive) and below `utilities` (demos still win). Repeats are harmless: a
   * layer statement that restates a known order is a no-op.
   */
  vite: {
    plugins: [
      {
        name: 'rowkit-layer-vitepress-css',
        enforce: 'pre',
        transform(code, id) {
          const path = id.split('?')[0] ?? id
          // Only VitePress's own theme CSS — not `docs/.vitepress/theme/*`.
          if (!path.includes('/node_modules/vitepress/') || !path.endsWith('.css')) {
            return null
          }
          if (code.includes('@layer vp-theme')) return null
          return {
            code: `@layer theme, base, vp-theme, components, utilities;\n@layer vp-theme {\n${code}\n}\n`,
            map: null,
          }
        },
      },
      tailwindcss() as unknown as VitePressPlugin,
    ],
  },

  head: [
    // The brand's paper and ink (Figma Brand — rowkit, Colour), light and dark.
    ['meta', { name: 'theme-color', content: '#FAFAF8', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#111114', media: '(prefers-color-scheme: dark)' }],
    // Each size is its own drawing on the pixel grid (Figma Brand, Favicons), so
    // the browser picks one rather than scaling the 32px mark down to a blur.
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: '16x16 32x32 48x48' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon-48.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    // The examples' theme, set before the first paint so a reload never flashes the other one.
    ['script', {}, themeBootScript],
    ...sharedHead,
  ],

  themeConfig: {
    // The logo is the mark and the wordmark; no second title beside it.
    logo: { light: '/logo.svg', dark: '/logo-light.svg', alt: 'rowkit' },
    siteTitle: false,

    nav: [
      { text: 'Guide', link: '/introduction' },
      { text: 'Components', link: '/components/' },
      { text: 'Patterns', link: '/patterns/data-table-page' },
      { text: 'Themes', link: '/foundations/themes' },
      { text: 'Storybook', link: 'https://storybook.rowkit.dev' },
      {
        text: '1.0 beta',
        items: [
          { text: 'Changelog', link: 'https://github.com/NikolaiKushner/rowkit/releases' },
          { text: 'Roadmap', link: '/roadmap' },
          { text: 'npm', link: 'https://www.npmjs.com/package/rowkit' },
        ],
      },
    ],

    /* Sections, groups, pages: nested `items` are groups; an item with a `link` is a page. */
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Installation', link: '/installation' },
          { text: 'API conventions', link: '/conventions' },
          { text: 'For coding agents', link: '/agents' },
        ],
      },
      {
        // The folder has a page of its own: every component, by subfolder.
        text: 'Components',
        link: '/components/',
        items: [
          {
            text: 'Foundations',
            items: [
              { text: 'Button', link: '/components/button' },
              { text: 'ButtonGroup', link: '/components/button-group' },
              { text: 'Separator', link: '/components/separator' },
              { text: 'Window', link: '/components/window' },
              { text: 'GroupBox', link: '/components/group-box' },
              { text: 'StatusBar', link: '/components/status-bar' },
              { text: 'ProgressBar', link: '/components/progress-bar' },
              { text: 'ScrollArea', link: '/components/scroll-area' },
            ],
          },
          {
            text: 'Forms',
            items: [
              { text: 'Field', link: '/components/field' },
              { text: 'Select', link: '/components/select' },
              { text: 'Checkbox', link: '/components/checkbox' },
              { text: 'Radio', link: '/components/radio' },
              { text: 'Badge', link: '/components/badge' },
            ],
          },
          {
            text: 'Data',
            items: [
              { text: 'DataTable', link: '/components/data-table' },
              { text: 'Pagination', link: '/components/pagination' },
              { text: 'FilterBar', link: '/components/filter-bar' },
              { text: 'EmptyState', link: '/components/empty-state' },
              { text: 'Skeleton', link: '/components/skeleton' },
            ],
          },
          {
            text: 'Overlays',
            items: [
              { text: 'Dialog', link: '/components/dialog' },
              { text: 'Toast', link: '/components/toast' },
              { text: 'Tooltip', link: '/components/tooltip' },
            ],
          },
        ],
      },
      {
        text: 'Patterns',
        items: [
          { text: 'A data table page', link: '/patterns/data-table-page' },
          { text: 'Forms', link: '/patterns/forms' },
          { text: 'Loading states', link: '/patterns/loading-states' },
        ],
      },
      {
        text: 'Foundations · Tokens',
        items: [
          { text: 'Themes', link: '/foundations/themes' },
          { text: 'Tokens', link: '/foundations/tokens' },
          { text: 'Icons', link: '/foundations/icons' },
          { text: 'Scrollbar', link: '/foundations/scrollbar' },
        ],
      },
      {
        text: 'Decisions',
        items: [
          { text: 'TypeScript pin', link: '/decisions/001-typescript-pin' },
          { text: 'No project references', link: '/decisions/002-no-project-references' },
          { text: 'Cell slot typing', link: '/decisions/003-cell-slot-typing' },
          { text: 'DataTable performance', link: '/decisions/004-datatable-performance' },
        ],
      },
      { text: 'Roadmap', link: '/roadmap' },
      { text: 'Contributing', link: '/contributing' },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/NikolaiKushner/rowkit' }],

    search: { provider: 'local' },

    editLink: {
      pattern: 'https://github.com/NikolaiKushner/rowkit/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'MIT licensed. 1.0 beta — the API is stabilising toward 1.0.0.',
      copyright: '© Nikolai Kushner',
    },
  },
})
