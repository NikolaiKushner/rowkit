import { describe, expect, it } from 'vitest'
import {
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
import { isInSrgbGamut, oklchToLinearRgb, parseOklch } from '../test/oklch'

const families = { neutral, primary, success, warning, danger }

describe('colour primitives', () => {
  it.each(Object.entries(families))('%s has all eleven steps', (_name, scale) => {
    expect(Object.keys(scale).map(Number)).toEqual([...colorSteps])
  })

  it.each(Object.entries(colorPrimitives))('%s is a parseable oklch() value', (_name, value) => {
    expect(() => parseOklch(value)).not.toThrow()
  })

  // OKLCH can express colours sRGB cannot. Browsers gamut-map those by their
  // own rules, so an unclamped token renders differently on a P3 display than
  // on an sRGB one. Every rowkit primitive is clamped to fit.
  it.each(Object.entries(colorPrimitives))('%s is inside the sRGB gamut', (_name, value) => {
    const { l, c, h } = parseOklch(value)
    expect(isInSrgbGamut(oklchToLinearRgb(l, c, h))).toBe(true)
  })

  it.each(Object.entries(families))('%s gets monotonically darker', (_name, scale) => {
    const lightness = colorSteps.map((step) => parseOklch(scale[step]).l)
    const descending = [...lightness].sort((a, b) => b - a)
    expect(lightness).toEqual(descending)
  })
})

describe('semantic colours', () => {
  const themes = { light: semanticColorLight, dark: semanticColorDark }

  // Hard rule 1: no hardcoded design values. A semantic token that inlined a
  // colour would be invisible to a re-theme.
  it.each(Object.entries(themes))('%s holds only primitive references', (_mode, theme) => {
    for (const [token, value] of Object.entries(theme)) {
      expect(value, `${token} should be a var() reference`).toMatch(/^var\(--color-[a-z0-9-]+\)$/)
    }
  })

  it.each(Object.entries(themes))('%s references primitives that exist', (_mode, theme) => {
    for (const [token, value] of Object.entries(theme)) {
      const name = /^var\(--color-([a-z0-9-]+)\)$/.exec(value)?.[1]
      expect(Object.keys(colorPrimitives), `${token} points at --color-${name}`).toContain(name)
    }
  })

  it('defines the same tokens in both themes', () => {
    expect(Object.keys(semanticColorDark).sort()).toEqual(Object.keys(semanticColorLight).sort())
  })

  it('does not reference a semantic token from another semantic token', () => {
    const semanticNames = new Set(Object.keys(semanticColorLight))
    for (const theme of Object.values(themes)) {
      for (const value of Object.values(theme)) {
        const name = /^var\(--color-([a-z0-9-]+)\)$/.exec(value)?.[1] ?? ''
        expect(semanticNames.has(name)).toBe(false)
      }
    }
  })
})
