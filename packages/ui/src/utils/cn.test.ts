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
 * Every ordered pair of tokens in a scale, merged: the second must win. One
 * test per scale rather than one per pair — the pairs are hundreds of rows of
 * the same assertion — and a failure lists every pair that went wrong.
 */
function collisions(prefix: string, names: readonly string[]): string[] {
  const failures: string[] = []
  for (const first of names) {
    for (const second of names) {
      if (first === second) continue
      const merged = cn(`${prefix}-${first}`, `${prefix}-${second}`)
      if (merged !== `${prefix}-${second}`) {
        failures.push(`${prefix}-${first} + ${prefix}-${second} → "${merged}"`)
      }
    }
  }
  return failures
}

/**
 * Scales whose class names `tailwind-merge` cannot group without help, read
 * from the token package so a new token that breaks merging fails here rather
 * than in a consumer's app.
 */
const customScales = [
  ['shadow', 'shadow', Object.keys(tokens.shadow)],
  ['z-index', 'z', Object.keys(tokens.zIndex)],
  ['duration', 'duration', Object.keys(tokens.motion.duration)],
  ['easing', 'ease', Object.keys(tokens.motion.easing)],
] as const

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

describe('token scales collide within themselves', () => {
  it.each(customScales)('%s: has at least two tokens to compare', (_scale, _prefix, names) => {
    expect(names.length).toBeGreaterThan(1)
  })

  // A scale of one token has nothing to collide with.
  it.each([...customScales, ...stockScales].filter(([, , names]) => names.length > 1))(
    '%s: the later token wins',
    (_scale, prefix, names) => {
      expect(collisions(prefix, names)).toEqual([])
    }
  )
})

/**
 * Semantic colours are what components actually reach for, and a consumer
 * overriding one has to win.
 */
describe('semantic colour utilities collide within a property', () => {
  const semantic = Object.keys(tokens.color.semantic)

  it.each(['bg', 'text', 'border', 'ring', 'fill'] as const)('%s-*', (prefix) => {
    const [first, second] = [semantic[0], semantic[1]]
    expect(cn(`${prefix}-${first}`, `${prefix}-${second}`)).toBe(`${prefix}-${second}`)
  })

  it('does not collide across properties', () => {
    expect(cn('bg-card', 'text-foreground')).toBe('bg-card text-foreground')
  })

  it('keeps every font size beside a text colour', () => {
    for (const size of Object.keys(tokens.font.size)) {
      expect(cn(`text-${size}`, 'text-foreground')).toBe(`text-${size} text-foreground`)
      expect(cn('text-foreground', `text-${size}`)).toBe(`text-foreground text-${size}`)
    }
  })

  it('keeps the disabled emboss beside the disabled colour', () => {
    expect(cn('text-text-disabled', 'text-shadow-disabled')).toBe(
      'text-text-disabled text-shadow-disabled'
    )
  })
})
