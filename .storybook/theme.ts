import { create } from 'storybook/theming'

/**
 * Storybook manager chrome, tuned to rowkit's tokens.
 *
 * Still the pre-redesign palette. The Windows 98 colours and logo for this chrome
 * come from the designer's brand frame; until then only the fonts follow the
 * interim token stack. Not a second brand for the workshop.
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
  fontBase:
    '"PT Sans", Tahoma, "Microsoft Sans Serif", "MS Sans Serif", Verdana, Arial, sans-serif',
  fontCode: '"Lucida Console", "Courier New", ui-monospace, monospace',
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
