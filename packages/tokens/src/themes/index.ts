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

/** A theme of your own, for {@link defineTheme}. */
export interface ThemeDefinition {
  /** Its name: the page switches to it with `data-theme="<name>"`. Lowercase, digits and dashes. */
  name: string
  /**
   * The theme it starts from. Every value it does not set comes from there,
   * so a theme is as small as what it changes. Default `modern`.
   */
  extends?: ThemeName
  /** Values for the light scheme — for a theme without a dark one, its only scheme. */
  light?: ThemeVars
  /**
   * Values for the dark scheme, on top of the light ones. A theme built on
   * `modern` inherits its dark scheme; set `dark: false` to have none.
   */
  dark?: ThemeVars | false
}

/** A rule declaring a theme's values and its colour scheme. */
export function themeRule(selector: string, scheme: 'light' | 'dark', values: ThemeVars): string {
  return [
    `${selector} {`,
    `  color-scheme: ${scheme};`,
    ...Object.entries(values).map(([name, value]) => `  ${name}: ${value};`),
    '}',
  ].join('\n')
}

/**
 * The stylesheet for a theme of your own.
 *
 * Every value is declared on the theme's element — the base theme's as well
 * as yours — because a variable that uses `var()` is resolved where it is
 * declared; that is also what lets themes nest. The dark scheme follows the
 * system unless `data-color-scheme` on the same element fixes it, exactly as
 * the modern theme's does.
 *
 * @example
 * ```ts
 * import { defineTheme } from '@rowkit/tokens'
 *
 * const css = defineTheme({
 *   name: 'acme',
 *   light: { '--color-control-primary': '#5b3df5', '--radius-md': '10px' },
 * })
 * ```
 */
export function defineTheme(theme: ThemeDefinition): string {
  if (!/^[a-z][a-z0-9-]*$/.test(theme.name)) {
    throw new Error(`defineTheme: "${theme.name}" is not a theme name (lowercase, digits, dashes)`)
  }
  const base = theme.extends ?? 'modern'
  const unknown = [...Object.keys(theme.light ?? {}), ...Object.keys(theme.dark || {})].filter(
    (name) => !(name in win98Vars)
  )
  if (unknown.length > 0) {
    throw new Error(`defineTheme: no rowkit token is called ${unknown.join(', ')}`)
  }

  const selector = `[data-theme="${theme.name}"]`
  const light = { ...(base === 'modern' ? modernLightVars : win98Vars), ...theme.light }
  const rules = [themeRule(selector, 'light', light)]

  if (theme.dark !== false && (base === 'modern' || theme.dark !== undefined)) {
    const dark = { ...(base === 'modern' ? modernDarkVars : {}), ...theme.dark }
    rules.push(
      [
        '@media (prefers-color-scheme: dark) {',
        themeRule(`${selector}:not([data-color-scheme="light"])`, 'dark', dark)
          .split('\n')
          .map((line) => `  ${line}`)
          .join('\n'),
        '}',
      ].join('\n'),
      themeRule(`${selector}[data-color-scheme="dark"]`, 'dark', dark)
    )
  }
  return `${rules.join('\n\n')}\n`
}
