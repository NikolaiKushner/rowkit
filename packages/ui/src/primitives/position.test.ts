import { describe, expect, it } from 'vitest'
import { place, type Side } from './position'

const viewport = { width: 1000, height: 800 }
const size = { width: 100, height: 30 }
const options = (side: Side) => ({ side, offset: 4, padding: 8 })
const anchorAt = (left: number, top: number) => ({ left, top, width: 80, height: 20 })

describe('place', () => {
  it.each([
    ['top', { x: 390, y: 366 }],
    ['bottom', { x: 390, y: 424 }],
    ['left', { x: 296, y: 395 }],
    ['right', { x: 484, y: 395 }],
  ] as const)('puts it centred on the %s side with the offset', (side, expected) => {
    expect(place(anchorAt(400, 400), size, viewport, options(side))).toEqual({ side, ...expected })
  })

  it.each([
    ['top', anchorAt(400, 10), 'bottom'],
    ['bottom', anchorAt(400, 780), 'top'],
    ['left', anchorAt(10, 400), 'right'],
    ['right', anchorAt(910, 400), 'left'],
  ] as const)(
    'flips %s to the opposite side when it would leave the screen',
    (side, anchor, flipped) => {
      expect(place(anchor, size, viewport, options(side)).side).toBe(flipped)
    }
  )

  it('keeps the preferred side when neither fits but it has more room', () => {
    const tall = { width: 100, height: 500 }
    const anchor = anchorAt(400, 450)
    expect(place(anchor, tall, viewport, options('top')).side).toBe('top')
  })

  it('slides along the edge to stay inside the viewport', () => {
    const nearLeft = place(anchorAt(0, 400), size, viewport, options('top'))
    expect(nearLeft.x).toBe(8)
    const nearRight = place(anchorAt(960, 400), size, viewport, options('top'))
    expect(nearRight.x).toBe(viewport.width - 8 - size.width)
  })
})
