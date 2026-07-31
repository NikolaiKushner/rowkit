import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitepress'

/**
 * The default theme, customised through CSS variables — not a custom theme.
 *
 * The default ships search, sidebar, prev/next, mobile nav, dark mode and its
 * own accessibility work. Rebuilding those produces a worse version of each,
 * and the brand is expressible entirely in `theme/tokens.css`.
 */
export default defineConfig({
  title: 'rowkit',
  description:
    'Vue 3 components for data-dense interfaces — tables, filters, and the states around them.',
  lang: 'en-GB',
  cleanUrls: true,

  // The internal planning specs are not product documentation.
  srcExclude: ['phases/**'],

  sitemap: { hostname: 'https://rowkit.dev' },

  /*
   * Vite inlines an `@import` but does not run Tailwind, so without this the
   * site loads the token custom properties, generates no utilities at all, and
   * renders every demo unstyled with no error anywhere — the same trap the
   * Storybook setup hit.
   */
  vite: { plugins: [tailwindcss()] },

  head: [
    ['meta', { name: 'theme-color', content: '#3b5bdb' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'rowkit' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Vue 3 components for data-dense interfaces.',
      },
    ],
  ],

  themeConfig: {
    siteTitle: 'rowkit',

    nav: [
      { text: 'Guide', link: '/introduction' },
      { text: 'Components', link: '/components/button' },
      { text: 'Decisions', link: '/decisions/001-typescript-pin' },
      {
        text: 'v0.x',
        items: [
          {
            text: 'Roadmap',
            link: 'https://github.com/NikolaiKushner/rowkit/blob/main/ROADMAP.md',
          },
          { text: 'Changelog', link: 'https://github.com/NikolaiKushner/rowkit/releases' },
        ],
      },
    ],

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
        text: 'Foundations',
        items: [
          { text: 'Tokens', link: '/foundations/tokens' },
          { text: 'Button', link: '/components/button' },
        ],
      },
      {
        text: 'Forms',
        items: [
          { text: 'Field', link: '/components/field' },
          { text: 'Select', link: '/components/select' },
          { text: 'Badge', link: '/components/badge' },
        ],
      },
      {
        text: 'Data',
        items: [
          { text: 'DataTable', link: '/components/data-table' },
          { text: 'TablePagination', link: '/components/table-pagination' },
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
      {
        text: 'Decisions',
        items: [
          { text: 'TypeScript pin', link: '/decisions/001-typescript-pin' },
          { text: 'No project references', link: '/decisions/002-no-project-references' },
          { text: 'Cell slot typing', link: '/decisions/003-cell-slot-typing' },
          { text: 'DataTable performance', link: '/decisions/004-datatable-performance' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/NikolaiKushner/rowkit' }],

    search: { provider: 'local' },

    editLink: {
      pattern: 'https://github.com/NikolaiKushner/rowkit/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'MIT licensed. v0.x — the API is stabilising toward v1.0.',
      copyright: '© Nikolai Kushner',
    },
  },
})
