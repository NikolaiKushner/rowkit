import { describe, expect, it } from 'vitest'
import { colorPrimitives, semanticColor, vga, win98 } from './color'
import { parseHex } from '../test/color'

describe('colour primitives', () => {
  it.each(Object.entries(colorPrimitives))('%s is a #rrggbb value', (_name, value) => {
    expect(() => parseHex(value)).not.toThrow()
  })

  // The palette is the design's, value for value. A typo here would shift a
  // colour every component paints, so the canonical ones are pinned.
  it('keeps the VGA and Windows 98 values exact', () => {
    expect(vga.silver).toBe('#c0c0c0')
    expect(vga.gray).toBe('#808080')
    expect(vga.navy).toBe('#000080')
    expect(vga.teal).toBe('#008080')
    expect(win98.light).toBe('#dfdfdf')
    expect(win98['title-blue']).toBe('#1084d0')
    expect(win98.info).toBe('#ffffe1')
  })

  it('names every primitive by its family', () => {
    for (const name of Object.keys(colorPrimitives)) expect(name).toMatch(/^(vga|win98)-[a-z-]+$/)
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
