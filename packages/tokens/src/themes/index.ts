import { semanticColor } from '../color'
import { radiusCss } from '../radius'
import { shadow } from '../shadow'
import { size } from '../size'
import { style } from '../style'
import { fontFamily, fontSize, fontWeight } from '../typography'
import {
  modernDarkColor,
  modernDarkShadow,
  modernFont,
  modernFontSize,
  modernFontWeight,
  modernLightColor,
  modernLightShadow,
  modernRadius,
  modernSize,
  modernStyle,
} from './modern'

export {
  modernDarkColor,
  modernDarkShadow,
  modernFont,
  modernFontSize,
  modernFontWeight,
  modernLightColor,
  modernLightShadow,
  modernPalette,
  modernRadius,
  modernSize,
  modernStyle,
} from './modern'
export type { ModernPaletteName } from './modern'

/** The themes rowkit ships. `win98` is the default: what `:root` carries. */
export const themeNames = ['win98', 'modern'] as const
export type ThemeName = (typeof themeNames)[number]

/** A theme as the stylesheet declares it: custom property name → value. */
export type ThemeVars = Record<`--${string}`, string>

/** Prefixes every key of a scale, turning it into custom property names. */
function vars(scale: Record<string, string>, prefix: `--${string}`): ThemeVars {
  const out: ThemeVars = {}
  for (const [key, value] of Object.entries(scale)) out[`${prefix}${key}`] = value
  return out
}

function fontSizeVars(scale: Record<string, { size: string; lineHeight: string }>): ThemeVars {
  const out: ThemeVars = {}
  for (const [key, value] of Object.entries(scale)) {
    out[`--text-${key}`] = value.size
    out[`--text-${key}--line-height`] = value.lineHeight
  }
  return out
}

const { full: _full, ...win98Radius } = radiusCss

/**
 * Windows 98, as variables: every value a theme may change, at its Windows 98
 * value. Declared on `[data-theme="win98"]` as well as being the default, so a
 * Windows 98 region inside a page in another theme is drawn in Windows 98.
 */
export const win98Vars: ThemeVars = {
  ...vars(semanticColor, '--color-'),
  ...vars(shadow, '--rk-shadow-'),
  ...vars(size, '--spacing-'),
  ...vars(win98Radius, '--radius-'),
  ...vars(style, '--rk-'),
  '--font-sans': fontFamily.sans,
  '--font-mono': fontFamily.mono,
  ...fontSizeVars(
    Object.fromEntries(
      Object.keys(modernFontSize).map((k) => [k, fontSize[k as keyof typeof fontSize]])
    )
  ),
  '--font-weight-strong': fontWeight.strong,
}

/** The modern theme in its light scheme. */
export const modernLightVars: ThemeVars = {
  ...vars(modernLightColor, '--color-'),
  ...vars(modernLightShadow, '--rk-shadow-'),
  ...vars(modernSize, '--spacing-'),
  ...vars(modernRadius, '--radius-'),
  ...vars(modernStyle, '--rk-'),
  '--font-sans': modernFont.sans,
  '--font-mono': modernFont.mono,
  ...fontSizeVars(modernFontSize),
  '--font-weight-strong': modernFontWeight.strong,
}

/** What the dark scheme changes on top of the light one. */
export const modernDarkVars: ThemeVars = Object.fromEntries(
  Object.entries({
    ...vars(modernDarkColor, '--color-'),
    ...vars(modernDarkShadow, '--rk-shadow-'),
  }).filter(([name, value]) => modernLightVars[name as `--${string}`] !== value)
)
