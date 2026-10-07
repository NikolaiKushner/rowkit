import { describe, expect, it } from 'vitest'
import { buildThemeCss } from '../css'
import { parseHexAlpha } from '../../test/color'
import { modernDarkVars, modernLightVars, modernPalette, win98Vars } from './index'

const css = buildThemeCss()

/** The declarations of the first rule whose selector is exactly `selector`. */
function rule(selector: string): string {
  const start = css.indexOf(`${selector} {`)
  if (start === -1) return ''
  return css.slice(start, css.indexOf('\n}', start))
}

describe('themes', () => {
  // A token the modern theme forgets would quietly stay Windows 98 inside it.
  it('the modern theme sets everything Windows 98 sets', () => {
    expect(Object.keys(modernLightVars).sort()).toEqual(Object.keys(win98Vars).sort())
  })

  it('the dark scheme changes only what the light scheme declares', () => {
    for (const name of Object.keys(modernDarkVars))
      expect(Object.keys(modernLightVars)).toContain(name)
  })

  // Themes nest because each one declares every value on its own element; see css.ts.
  it.each([
    ['[data-theme="win98"]', win98Vars],
    ['[data-theme="modern"]', modernLightVars],
    ['[data-theme="modern"][data-color-scheme="dark"]', modernDarkVars],
  ] as const)('%s declares each of its values', (selector, values) => {
    const body = rule(selector)
    for (const [name, value] of Object.entries(values)) expect(body).toContain(`${name}: ${value};`)
  })

  it('follows the system to dark unless the scheme is fixed to light', () => {
    expect(css).toMatch(
      /@media \(prefers-color-scheme: dark\) \{\s+\[data-theme="modern"\]:not\(\[data-color-scheme="light"\]\) \{\s+color-scheme: dark;/
    )
  })

  it.each(Object.entries(modernPalette))('modern palette: %s is a hex colour', (_name, value) => {
    expect(() => parseHexAlpha(value)).not.toThrow()
  })

  it('reads shadows from variables, so a theme can change them', () => {
    expect(css).toContain('--shadow-raised: var(--rk-shadow-raised);')
  })
})
