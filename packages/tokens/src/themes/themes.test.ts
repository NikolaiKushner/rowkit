import { describe, expect, it } from 'vitest'
import { buildThemeCss } from '../css'
import { parseHexAlpha } from '../../test/color'
import { defineTheme, modernDarkVars, modernLightVars, modernPalette, win98Vars } from './index'

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

describe('defineTheme', () => {
  const acme = defineTheme({
    name: 'acme',
    light: { '--color-control-primary': '#5b3df5', '--radius-md': '10px' },
    dark: { '--color-control-primary': '#7c66ff' },
  })

  it('declares every value on the theme, the base theme’s included', () => {
    for (const name of Object.keys(modernLightVars)) expect(acme).toContain(`  ${name}: `)
    expect(acme).toContain('[data-theme="acme"] {\n  color-scheme: light;')
  })

  it('puts its own values over the base theme’s', () => {
    const light = acme.slice(0, acme.indexOf('@media'))
    expect(light).toContain('--color-control-primary: #5b3df5;')
    expect(light).not.toContain(
      `--color-control-primary: ${modernLightVars['--color-control-primary'] ?? ''};`
    )
  })

  it('follows the system to dark, and can be fixed either way', () => {
    expect(acme).toMatch(
      /@media \(prefers-color-scheme: dark\) \{\s+\[data-theme="acme"\]:not\(\[data-color-scheme="light"\]\) \{\s+color-scheme: dark;/
    )
    expect(acme).toContain('[data-theme="acme"][data-color-scheme="dark"] {')
    expect(acme.slice(acme.indexOf('@media'))).toContain('--color-control-primary: #7c66ff;')
  })

  it('has no dark scheme when built on Windows 98 without one, or when asked', () => {
    expect(defineTheme({ name: 'retro', extends: 'win98' })).not.toContain('color-scheme: dark')
    expect(defineTheme({ name: 'flat', dark: false })).not.toContain('color-scheme: dark')
  })

  it('refuses a token that does not exist, and a name that cannot be an attribute value', () => {
    expect(() => defineTheme({ name: 'acme', light: { '--color-brand': 'red' } })).toThrow(
      /--color-brand/
    )
    expect(() => defineTheme({ name: 'Acme Theme' })).toThrow(/not a theme name/)
  })
})
