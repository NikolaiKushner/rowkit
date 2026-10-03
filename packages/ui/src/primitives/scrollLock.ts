import { getCurrentScope, onScopeDispose } from 'vue'
import { isClient } from './dom'

/**
 * Page scroll lock shared by every open modal layer.
 *
 * The page stops scrolling while at least one caller holds the lock and comes
 * back exactly as it was when the last one lets go: the inline `overflow` and
 * `padding-right` it had before are put back, not cleared.
 *
 * Hiding the scroll bar would widen the page by the bar's width and shift
 * everything sideways; the same width is added as right padding while locked so
 * nothing under the dialog moves.
 */
let holders = 0
let saved: { overflow: string; paddingRight: string } | undefined

function engage(): void {
  holders += 1
  if (holders > 1 || !isClient) return
  const { style } = document.body
  saved = { overflow: style.overflow, paddingRight: style.paddingRight }
  const pageWidth = document.documentElement.clientWidth
  const barWidth = pageWidth > 0 ? window.innerWidth - pageWidth : 0
  if (barWidth > 0) {
    const current = parseFloat(getComputedStyle(document.body).paddingRight) || 0
    style.paddingRight = `${String(current + barWidth)}px`
  }
  style.overflow = 'hidden'
}

function disengage(): void {
  if (holders === 0) return
  holders -= 1
  if (holders > 0 || !isClient || !saved) return
  const { style } = document.body
  style.overflow = saved.overflow
  style.paddingRight = saved.paddingRight
  saved = undefined
}

/**
 * Takes part in the shared lock and returns a switch for this caller's hold.
 *
 * Called inside a component (or any effect scope), the hold is released
 * automatically when that scope ends, so a dialog that unmounts while open
 * never leaves the page frozen.
 *
 * @param initial - Whether this caller holds the lock from the start.
 * @returns `set(locked)` — take or release this caller's hold. Repeated calls
 * with the same value do nothing.
 */
export function useBodyScrollLock(initial: boolean): (locked: boolean) => void {
  let holding = false

  const set = (locked: boolean): void => {
    if (locked === holding) return
    holding = locked
    if (locked) engage()
    else disengage()
  }

  set(initial)
  if (getCurrentScope()) onScopeDispose(() => set(false))
  return set
}
