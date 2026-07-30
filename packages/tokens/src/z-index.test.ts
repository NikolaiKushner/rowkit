import { describe, expect, it } from 'vitest'
import { zIndex, type ZIndexName } from './z-index'

/**
 * The stacking order is a contract, not a comment.
 *
 * Phase 4's overlays depend on it: a toast has to be readable over a modal, and
 * a select inside a dialog has to open above it. Both are ordering facts that a
 * well-meaning tweak to one token would break silently, because nothing else in
 * the toolchain knows the layers are meant to be ranked.
 */

const order: readonly ZIndexName[] = [
  'base',
  'sticky',
  'dropdown',
  'overlay',
  'modal',
  'popover',
  'toast',
  'tooltip',
]

const value = (name: ZIndexName) => Number(zIndex[name])

describe('stacking layers', () => {
  it('covers every token, so a new layer has to be placed deliberately', () => {
    expect([...order].sort()).toEqual(Object.keys(zIndex).sort())
  })

  it('ranks strictly upward', () => {
    const values = order.map(value)
    expect(values).toEqual([...values].sort((a, b) => a - b))
    expect(new Set(values).size, 'no two layers share a value').toBe(values.length)
  })

  it('leaves room between layers for a consumer to slot their own chrome', () => {
    // An app header or cookie banner belongs between two rowkit layers without
    // editing rowkit or starting a `z-index: 99999` arms race.
    for (const [i, name] of order.slice(1).entries()) {
      const gap = value(name) - value(order[i]!)
      expect(gap, `${order[i]!} → ${name}`).toBeGreaterThanOrEqual(100)
    }
  })

  describe('the orderings Phase 4 depends on', () => {
    it('puts a sticky table header below a dropdown', () => {
      // A menu opened from a toolbar must paint over a pinned header, not under.
      expect(value('sticky')).toBeLessThan(value('dropdown'))
    })

    it('puts the modal surface above its own backdrop', () => {
      expect(value('overlay')).toBeLessThan(value('modal'))
    })

    it('puts a popover above a modal', () => {
      // A Select inside a Dialog is the case: its listbox has to escape upward.
      expect(value('modal')).toBeLessThan(value('popover'))
    })

    it('puts a toast above a modal', () => {
      // A "saved" confirmation has to be visible over an open dialog.
      expect(value('modal')).toBeLessThan(value('toast'))
    })

    it('puts a tooltip above everything', () => {
      // A toast can carry an action button, and that button can have a tooltip.
      expect(value('tooltip')).toBe(Math.max(...order.map(value)))
    })
  })
})
