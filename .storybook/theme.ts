import { create } from 'storybook/theming'

/**
 * Storybook manager chrome, tuned to rowkit's tokens.
 *
 * Ink-blue primary, quiet neutrals, Geist — the same restraint as the
 * components. Not a second brand for the workshop.
 */
export default create({
  base: 'light',

  // Ink blue — primary-800. Cool, not brown.
  colorPrimary: '#0c335f',
  colorSecondary: '#0c335f',

  // Surfaces — gray-988 page, white card, gray-940 hairline.
  appBg: '#F7F8FA',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#F7F8FA',
  appBorderColor: '#E4E7EC',
  appBorderRadius: 6,

  // Type
  fontBase: '"Geist Variable", Geist, ui-sans-serif, system-ui, sans-serif',
  fontCode: '"Geist Mono Variable", "Geist Mono", ui-monospace, monospace',
  textColor: '#1A1D21',
  textMutedColor: '#6B7280',
  textInverseColor: '#F7F8FA',

  // Toolbar
  barBg: '#FFFFFF',
  barTextColor: '#6B7280',
  barSelectedColor: '#0c335f',
  barHoverColor: '#0c335f',

  // Controls
  inputBg: '#FFFFFF',
  inputBorder: '#9AA3AD',
  inputTextColor: '#1A1D21',
  inputBorderRadius: 6,

  // Brand
  brandTitle: 'rowkit',
  brandUrl: 'https://rowkit.dev',
  // Wordmark lockup — mark + “rowkit”. Served from docs/public via staticDirs.
  brandImage: '/logo.svg',
  brandTarget: '_self',
})
