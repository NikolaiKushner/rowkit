import { describe, expect, it } from 'vitest'
import { colorPrimitives, semanticColorDark, semanticColorLight } from './color'
import { buildThemeCss } from './css'
import { duration, easing } from './motion'
import { radius } from './radius'
import { shadow } from './shadow'
import { spacing } from './spacing'
import { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } from './typography'
import { zIndex } from './z-index'

const css = buildThemeCss()

/** Declarations inside the `@theme { ... }` block. */
const themeBlock = /@theme \{([\s\S]*?)\n\}/.exec(css)?.[1] ?? ''
/** Declarations inside the `.dark { ... }` block. */
const darkBlock = /\.dark \{([\s\S]*?)\n\}/.exec(css)?.[1] ?? ''

describe('generated stylesheet', () => {
  it('emits a @theme block and a .dark block', () => {
    expect(themeBlock).not.toBe('')
    expect(darkBlock).not.toBe('')
  })

  it('marks itself as generated so nobody edits it by hand', () => {
    expect(css).toContain('DO NOT EDIT')
  })

  // Tailwind v4 defaults `dark:` to prefers-color-scheme. Without this the
  // .dark block would never apply and the whole dark theme would be dead code.
  it('switches the dark variant to a class', () => {
    expect(css).toContain('@custom-variant dark (&:where(.dark, .dark *));')
  })
})

describe('every token reaches the stylesheet', () => {
  const cases: readonly (readonly [string, Record<string, unknown>, string])[] = [
    ['colour primitives', colorPrimitives, '--color-'],
    ['semantic colours', semanticColorLight, '--color-'],
    ['spacing', spacing, '--spacing-'],
    ['font families', fontFamily, '--font-'],
    ['font weights', fontWeight, '--font-weight-'],
    ['letter spacing', letterSpacing, '--tracking-'],
    ['line heights', lineHeight, '--leading-'],
    ['radii', radius, '--radius-'],
    ['shadows', shadow, '--shadow-'],
    // These prefixes are Tailwind v4 theme namespaces, not free-form names —
    // see the note in css.ts. packages/ui/src/styles/theme.test.ts compiles
    // them for real and is what catches a wrong one.
    ['durations', duration, '--transition-duration-'],
    ['easings', easing, '--ease-'],
    ['stacking layers', zIndex, '--z-index-'],
  ]

  it.each(cases)('%s', (_label, scale, prefix) => {
    for (const key of Object.keys(scale)) {
      expect(themeBlock, `missing ${prefix}${key}`).toContain(`${prefix}${key}:`)
    }
  })

  it('font sizes, each paired with its line height', () => {
    for (const key of Object.keys(fontSize)) {
      expect(themeBlock).toContain(`--text-${key}:`)
      expect(themeBlock).toContain(`--text-${key}--line-height:`)
    }
  })

  it('the Tailwind spacing base, so fractional utilities keep working', () => {
    expect(themeBlock).toMatch(/--spacing:\s/)
  })
})

describe('dark mode', () => {
  it('overrides every semantic colour', () => {
    for (const key of Object.keys(semanticColorDark)) {
      expect(darkBlock, `missing --color-${key}`).toContain(`--color-${key}:`)
    }
  })

  // Primitives are theme-agnostic: dark mode repoints semantic tokens at
  // different primitives rather than redefining what `primary-600` means.
  it('redefines no primitives', () => {
    for (const key of Object.keys(colorPrimitives)) {
      expect(darkBlock, `--color-${key} must not be themed`).not.toContain(`--color-${key}:`)
    }
  })

  it('overrides nothing that is not a semantic colour', () => {
    const declared = [...darkBlock.matchAll(/--([a-z0-9-]+):/g)].map((m) => m[1])
    const allowed = new Set(Object.keys(semanticColorDark).map((k) => `color-${k}`))
    for (const name of declared) {
      expect(allowed.has(name ?? ''), `unexpected override --${name}`).toBe(true)
    }
  })
})
