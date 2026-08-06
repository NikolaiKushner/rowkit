import { tokens } from '@rowkit/tokens'
import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins class values', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('accepts the conditional forms clsx supports', () => {
    expect(cn('a', ['b', 'c'], { d: true, e: false }, undefined, null, false)).toBe('a b c d')
  })

  it('lets the last conflicting utility win', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6')
  })

  it('keeps utilities that only look similar', () => {
    // Font size and text colour share the `text-` prefix but not a group.
    expect(cn('text-sm', 'text-muted-foreground')).toBe('text-sm text-muted-foreground')
  })
})

/**
 * A scale whose class names `tailwind-merge` cannot group without help. Each
 * case is generated from the token package, so adding a token that breaks
 * merging fails here rather than in a consumer's app.
 */
const customScales = [
  ['shadow', 'shadow', Object.keys(tokens.shadow)],
  ['z-index', 'z', Object.keys(tokens.zIndex)],
  ['duration', 'duration', Object.keys(tokens.motion.duration)],
  ['easing', 'ease', Object.keys(tokens.motion.easing)],
] as const

describe.each(customScales)('%s tokens collide with each other', (_scale, prefix, names) => {
  it('has at least two tokens to compare', () => {
    expect(names.length).toBeGreaterThan(1)
  })

  it.each(names.flatMap((a) => names.filter((b) => b !== a).map((b) => [a, b] as const)))(
    `${prefix}-%s then ${prefix}-%s resolves to the second`,
    (first, second) => {
      expect(cn(`${prefix}-${first}`, `${prefix}-${second}`)).toBe(`${prefix}-${second}`)
    }
  )
})

/**
 * Scales `tailwind-merge` already handles, asserted so that a future config
 * change cannot quietly regress them.
 */
const stockScales = [
  ['radius', 'rounded', Object.keys(tokens.radius)],
  ['font size', 'text', Object.keys(tokens.font.size)],
  ['font weight', 'font', Object.keys(tokens.font.weight)],
  ['tracking', 'tracking', Object.keys(tokens.font.letterSpacing)],
  ['leading', 'leading', Object.keys(tokens.font.lineHeight)],
  ['font family', 'font', Object.keys(tokens.font.family)],
  ['spacing', 'p', Object.keys(tokens.spacing)],
] as const

describe.each(stockScales)('%s tokens collide with each other', (_scale, prefix, names) => {
  it.each(names.flatMap((a) => names.filter((b) => b !== a).map((b) => [a, b] as const)))(
    `${prefix}-%s then ${prefix}-%s resolves to the second`,
    (first, second) => {
      expect(cn(`${prefix}-${first}`, `${prefix}-${second}`)).toBe(`${prefix}-${second}`)
    }
  )
})

/**
 * Semantic colours are what components actually reach for, and a consumer
 * overriding one has to win.
 */
describe('semantic colour utilities collide within a property', () => {
  const semantic = Object.keys(tokens.color.semantic.light)

  it.each(['bg', 'text', 'border', 'ring', 'fill'] as const)('%s-*', (prefix) => {
    const [first, second] = [semantic[0], semantic[1]]
    expect(cn(`${prefix}-${first}`, `${prefix}-${second}`)).toBe(`${prefix}-${second}`)
  })

  it('does not collide across properties', () => {
    expect(cn('bg-card', 'text-foreground')).toBe('bg-card text-foreground')
  })
})
