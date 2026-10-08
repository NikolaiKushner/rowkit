import { tokens } from '@rowkit/tokens'
import { create } from 'storybook/theming'

/**
 * Storybook's own chrome — sidebar, toolbars, addon panel — in the Windows 98
 * design, so the workshop looks like the docs site's Explorer window.
 *
 * Storybook's theme takes literal colours, so they are read from the token
 * package rather than written out: a palette change reaches this chrome in the
 * same commit. The bevels and the rest of what a theme object cannot express
 * live in `manager.ts`.
 */
const { vga, win98 } = tokens.color

export default create({
  base: 'light',

  // Selection and focus: navy, as a Windows 98 list highlights its item.
  colorPrimary: vga.navy,
  colorSecondary: vga.navy,

  // Every surface is the window face; the preview frame sits on it too.
  appBg: vga.silver,
  appContentBg: vga.silver,
  appPreviewBg: vga.silver,
  appBorderColor: vga.gray,
  appBorderRadius: 0,

  fontBase: tokens.font.family.sans,
  fontCode: tokens.font.family.mono,
  textColor: vga.black,
  textMutedColor: win98['dark-gray'],
  textInverseColor: vga.white,

  barBg: vga.silver,
  barTextColor: vga.black,
  barSelectedColor: vga.navy,
  barHoverColor: vga.navy,

  buttonBg: vga.silver,
  buttonBorder: vga.gray,
  booleanBg: vga.silver,
  booleanSelectedBg: vga.white,

  inputBg: vga.white,
  inputBorder: vga.gray,
  inputTextColor: vga.black,
  inputBorderRadius: 0,

  brandTitle: 'rowkit',
  brandUrl: 'https://rowkit.dev',
  // The logo drawn for the Storybook sidebar, 24px tall (Figma brand/logo-storybook).
  // Served from docs/public via staticDirs.
  brandImage: '/logo-storybook.svg',
  brandTarget: '_self',
})
