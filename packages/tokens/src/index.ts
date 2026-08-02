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
 * tokens.color.primary[600] // 'oklch(0.546 0.209 259)'
 * ```
 *
 * @example The stylesheet
 * ```css
 * @import 'tailwindcss';
 * @import '@rowkit/tokens/css';
 * ```
 */

import { version as pkgVersion } from '../package.json' with { type: 'json' }
import {
  colorPrimitives,
  danger,
  neutral,
  primary,
  semanticColorDark,
  semanticColorLight,
  success,
  warning,
} from './color'
import { duration, easing } from './motion'
import { radius } from './radius'
import { shadow } from './shadow'
import { spacing, spacingBase } from './spacing'
import { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } from './typography'
import { zIndex } from './z-index'

export {
  colorPrimitives,
  colorSteps,
  danger,
  neutral,
  primary,
  semanticColorDark,
  semanticColorLight,
  success,
  warning,
} from './color'
export type { ColorRef, ColorStep, SemanticColorName } from './color'

export { duration, easing } from './motion'
export type { DurationName, EasingName } from './motion'

export { radius } from './radius'
export type { RadiusName } from './radius'

export { shadow } from './shadow'
export type { ShadowName } from './shadow'

export { spacing, spacingBase } from './spacing'
export type { SpacingName } from './spacing'

export { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } from './typography'
export type { FontSizeName } from './typography'

export { zIndex } from './z-index'
export type { ZIndexName } from './z-index'

export { buildThemeCss } from './css'

/**
 * Every rowkit token in one object.
 *
 * Grouped by scale rather than flattened, so `tokens.color.primary[600]`
 * narrows to its literal type and autocompletes each level.
 */
export const tokens = {
  color: {
    neutral,
    primary,
    success,
    warning,
    danger,
    /** Flat map of every primitive, keyed by CSS custom property suffix. */
    primitives: colorPrimitives,
    /** Semantic tokens, which reference primitives via `var()`. */
    semantic: {
      light: semanticColorLight,
      dark: semanticColorDark,
    },
  },
  spacing,
  spacingBase,
  font: {
    family: fontFamily,
    size: fontSize,
    weight: fontWeight,
    letterSpacing,
    lineHeight,
  },
  radius,
  shadow,
  zIndex,
  motion: {
    duration,
    easing,
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
