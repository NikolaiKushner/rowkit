import { describe, expect, it } from 'vitest'
import {
  colorPrimitives,
  colorSteps,
  danger,
  neutral,
  primary,
  semanticColor,
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
  // Hard rule 1: no hardcoded design values. A semantic token that inlined a
  // colour would be invisible to a re-theme.
  it('holds only primitive references', () => {
    for (const [token, value] of Object.entries(semanticColor)) {
      expect(value, `${token} should be a var() reference`).toMatch(/^var\(--color-[a-z0-9-]+\)$/)
    }
  })

  it('references primitives that exist', () => {
    for (const [token, value] of Object.entries(semanticColor)) {
      const name = /^var\(--color-([a-z0-9-]+)\)$/.exec(value)?.[1]
      expect(Object.keys(colorPrimitives), `${token} points at --color-${name}`).toContain(name)
    }
  })

  it('does not reference a semantic token from another semantic token', () => {
    const semanticNames = new Set(Object.keys(semanticColor))
    for (const value of Object.values(semanticColor)) {
      const name = /^var\(--color-([a-z0-9-]+)\)$/.exec(value)?.[1] ?? ''
      expect(semanticNames.has(name)).toBe(false)
    }
  })
})
