/**
 * `@rowkit/tokens` — the design token layer behind rowkit.
 *
 * Consumable on its own: import {@link tokens} for a fully typed object, or
 * `@rowkit/tokens/css` for the Tailwind v4 `@theme` block. Nothing here depends
 * on Vue, so a design tool, a docs site, or a chart library can read the same
 * values the components use.
 *
 * @example Typed access to a primitive
 * ```ts
 * import { tokens } from '@rowkit/tokens'
 * tokens.color.vga.silver // '#c0c0c0' — the face of every window
 * ```
 *
 * @example The stylesheet
 * ```css
 * @import 'tailwindcss';
 * @import '@rowkit/tokens/css';
 * ```
 */

import { version as pkgVersion } from '../package.json' with { type: 'json' }
import { colorPrimitives, semanticColor, vga, win98 } from './color'
import { duration, easing } from './motion'
import { radius, radiusBase } from './radius'
import { shadow, textShadow } from './shadow'
import { size } from './size'
import { spacing, spacingBase } from './spacing'
import { style } from './style'
import { modernDarkVars, modernLightVars, win98Vars } from './themes'
import { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } from './typography'
import { zIndex } from './z-index'

export { colorPrimitives, semanticColor, vga, win98 } from './color'
export type { ColorRef, SemanticColorName } from './color'

export { duration, easing } from './motion'
export type { DurationName, EasingName } from './motion'

export { radius, radiusBase } from './radius'
export type { RadiusName } from './radius'

export { shadow, textShadow } from './shadow'
export type { ShadowName, TextShadowName } from './shadow'

export { spacing, spacingBase } from './spacing'
export type { SpacingName } from './spacing'

export { size } from './size'
export type { SizeName } from './size'

export { style } from './style'
export type { StyleName } from './style'

export {
  modernDarkColor,
  modernDarkShadow,
  modernDarkVars,
  modernFont,
  modernFontSize,
  modernFontWeight,
  modernLightColor,
  modernLightShadow,
  modernLightVars,
  modernPalette,
  modernRadius,
  modernSize,
  modernStyle,
  defineTheme,
  themeNames,
  themeRule,
  win98Vars,
} from './themes'
export type {
  ModernPaletteName,
  ThemeDefinition,
  ThemeName,
  ThemeTokenName,
  ThemeValues,
  ThemeVars,
} from './themes'

export { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } from './typography'
export type { FontSizeName } from './typography'

export { zIndex } from './z-index'
export type { ZIndexName } from './z-index'

export { buildThemeCss } from './css'

/**
 * Every rowkit token in one object.
 *
 * Grouped by scale rather than flattened, so `tokens.color.vga.navy` narrows
 * to its literal type and autocompletes each level.
 */
export const tokens = {
  color: {
    /** The VGA palette Windows 98 is drawn in. */
    vga,
    /** The system colours Windows 98 added to it. */
    win98,
    /** Flat map of every primitive, keyed by CSS custom property suffix. */
    primitives: colorPrimitives,
    /** Semantic tokens, which reference primitives via `var()`. */
    semantic: semanticColor,
  },
  spacing,
  spacingBase,
  size,
  style,
  font: {
    family: fontFamily,
    size: fontSize,
    weight: fontWeight,
    letterSpacing,
    lineHeight,
  },
  radius,
  radiusBase,
  shadow,
  textShadow,
  zIndex,
  motion: {
    duration,
    easing,
  },
  /** Each theme as the variables it declares. */
  themes: {
    win98: win98Vars,
    modern: { light: modernLightVars, dark: modernDarkVars },
  },
} as const

/** The shape of {@link tokens}. */
export type Tokens = typeof tokens

/**
 * The `@rowkit/tokens` version this build was produced from.
 *
 * Read from `package.json` rather than written out. A literal here went stale
 * the moment Changesets bumped the manifest — it edits `package.json` and
 * nothing was updating the constant, so the first release broke its own test.
 * Rollup tree-shakes the JSON down to this one string, so nothing else ships.
 */
export const version: string = pkgVersion
