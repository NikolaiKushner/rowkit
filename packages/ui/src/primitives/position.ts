import { onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { isClient } from './dom'

export type Side = 'top' | 'right' | 'bottom' | 'left'

export interface PlaceOptions {
  /** The preferred side. Used unless the floating element does not fit there. */
  side: Side
  /** Gap between anchor and floating element, in px. */
  offset: number
  /** Minimum distance kept from the viewport edge, in px. */
  padding: number
}

export interface Placement {
  x: number
  y: number
  /** The side actually used — the preferred one, or its opposite after a flip. */
  side: Side
}

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

/**
 * Where to put a floating element of `size` next to `anchor`, in viewport
 * coordinates for `position: fixed`.
 *
 * Centred on the anchor along the edge it sits on. If it does not fit on the
 * preferred side it flips to the opposite one, and if neither fits it takes
 * whichever has more room. Then it slides along the edge to stay inside the
 * viewport — a tooltip clipped by the screen is worse than an off-centre one.
 *
 * Pure, so it is tested on numbers rather than on layout.
 */
export function place(
  anchor: { top: number; left: number; width: number; height: number },
  size: { width: number; height: number },
  viewport: { width: number; height: number },
  { side, offset, padding }: PlaceOptions
): Placement {
  const at = (s: Side) => {
    const centreX = anchor.left + anchor.width / 2 - size.width / 2
    const centreY = anchor.top + anchor.height / 2 - size.height / 2
    switch (s) {
      case 'top':
        return { x: centreX, y: anchor.top - offset - size.height }
      case 'bottom':
        return { x: centreX, y: anchor.top + anchor.height + offset }
      case 'left':
        return { x: anchor.left - offset - size.width, y: centreY }
      case 'right':
        return { x: anchor.left + anchor.width + offset, y: centreY }
    }
  }

  /** Room left on the main axis; negative means it overflows. */
  const room = (s: Side, p: { x: number; y: number }) => {
    switch (s) {
      case 'top':
        return p.y - padding
      case 'bottom':
        return viewport.height - padding - (p.y + size.height)
      case 'left':
        return p.x - padding
      case 'right':
        return viewport.width - padding - (p.x + size.width)
    }
  }

  const preferred = at(side)
  const opposite = OPPOSITE[side]
  const flipped = at(opposite)
  let resolved: Side = side
  let point = preferred
  if (room(side, preferred) < 0) {
    if (room(opposite, flipped) >= 0 || room(opposite, flipped) > room(side, preferred)) {
      resolved = opposite
      point = flipped
    }
  }

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), Math.max(min, max))
  const vertical = resolved === 'top' || resolved === 'bottom'
  return {
    side: resolved,
    x: vertical ? clamp(point.x, padding, viewport.width - padding - size.width) : point.x,
    y: vertical ? point.y : clamp(point.y, padding, viewport.height - padding - size.height),
  }
}

/**
 * Keeps `floating` placed next to `anchor` while both are mounted, and
 * re-places it when either resizes or the window does.
 *
 * Returns the style to bind and the side actually used. Placement runs before
 * the browser paints, so the element never shows at the origin first.
 */
export function useFloating(
  anchor: Ref<HTMLElement | undefined>,
  floating: Ref<HTMLElement | undefined>,
  options: () => PlaceOptions
): { style: Ref<Record<string, string>>; side: Ref<Side> } {
  const style = ref<Record<string, string>>({ position: 'fixed', top: '0px', left: '0px' })
  const side = ref<Side>(options().side)

  const update = () => {
    const a = anchor.value
    const f = floating.value
    if (!a || !f) return
    const result = place(
      a.getBoundingClientRect(),
      { width: f.offsetWidth, height: f.offsetHeight },
      { width: window.innerWidth, height: window.innerHeight },
      options()
    )
    side.value = result.side
    style.value = {
      position: 'fixed',
      top: `${String(Math.round(result.y))}px`,
      left: `${String(Math.round(result.x))}px`,
    }
  }

  let observer: ResizeObserver | undefined
  watch(
    [anchor, floating, options],
    ([a, f], _, onCleanup) => {
      if (!isClient || !a || !f) return
      update()
      window.addEventListener('resize', update)
      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(update)
        observer.observe(a)
        observer.observe(f)
      }
      onCleanup(() => {
        window.removeEventListener('resize', update)
        observer?.disconnect()
      })
    },
    { immediate: true, flush: 'post' }
  )
  onBeforeUnmount(() => observer?.disconnect())

  return { style, side }
}
