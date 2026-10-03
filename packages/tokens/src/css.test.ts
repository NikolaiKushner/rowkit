import { describe, expect, it } from 'vitest'
import { colorPrimitives, semanticColor } from './color'
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

describe('generated stylesheet', () => {
  it('emits a @theme block', () => {
    expect(themeBlock).not.toBe('')
  })

  // rowkit has one theme. A `.dark` block or a `dark:` variant left behind
  // would invite consumers to build on a theme that no longer exists.
  it('emits no dark theme', () => {
    expect(css).not.toContain('.dark')
    expect(css).not.toContain('@custom-variant dark')
  })

  it('marks itself as generated so nobody edits it by hand', () => {
    expect(css).toContain('DO NOT EDIT')
  })
})

describe('every token reaches the stylesheet', () => {
  const cases: readonly (readonly [string, Record<string, unknown>, string])[] = [
    ['colour primitives', colorPrimitives, '--color-'],
    ['semantic colours', semanticColor, '--color-'],
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
