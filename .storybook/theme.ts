import { create } from 'storybook/theming'

/**
 * Storybook's own chrome — sidebar, toolbars, addon panel — in the brand's
 * colours, not a theme's: the workshop frames the components in whichever
 * theme the toolbar picks, Windows 98 or modern, and belongs to neither.
 *
 * Ink and paper, the vermilion accent for what is selected, Storybook's own
 * shapes. Light or dark by the system, as the brand pictures are. The values
 * are the Figma file's `brand` collection; the brand stands above the themes,
 * so it has no tokens of its own in `@rowkit/tokens`.
 */
const brand = {
  ink: '#111114',
  paper: '#fafaf8',
  vermilion: '#d63a1f',
  graphite: '#5e5f66',
  mist: '#efefec',
  night: '#0b0b0d',
}

const shared = {
  brandTitle: 'rowkit',
  brandUrl: 'https://rowkit.dev',
  brandTarget: '_self',
  // White on vermilion: 4.6:1.
  colorPrimary: brand.vermilion,
  colorSecondary: brand.vermilion,
  fontBase: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  fontCode: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
} as const

export const light = create({
  base: 'light',
  ...shared,
  appBg: brand.paper,
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: brand.mist,
  textColor: brand.ink,
  textMutedColor: brand.graphite,
  barBg: brand.paper,
  // The logo drawn for the Storybook sidebar, 24px tall (Figma brand/logo-storybook).
  // Served from docs/public via staticDirs.
  brandImage: '/logo-storybook.svg',
})

export const dark = create({
  base: 'dark',
  ...shared,
  appBg: brand.night,
  appContentBg: brand.ink,
  appPreviewBg: brand.ink,
  textColor: brand.paper,
  barBg: brand.night,
  // The same logo with white letters (Figma brand/logo, ink=reverse).
  brandImage: '/logo-light.svg',
})

/** The chrome for the system's scheme when Storybook opens. */
export const forScheme = (): typeof light =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? dark
    : light

export default light
