import { getCurrentInstance, nextTick, onBeforeUnmount } from 'vue'
import { isClient } from './dom'

const lockers = new Set<symbol>()
let initialOverflow: string | undefined
let stopTouchMove: (() => void) | undefined

const isIOS =
  isClient &&
  (/iP(ad|hone|od)/.test(navigator.platform) ||
    (navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform)))

function lock(): void {
  initialOverflow ??= document.body.style.overflow
  // Pad by the scrollbar's width so the page does not shift sideways when the
  // scrollbar disappears.
  const scrollbar = window.innerWidth - document.documentElement.clientWidth
  if (scrollbar > 0) {
    document.body.style.paddingRight = `${scrollbar}px`
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbar}px`)
  }
  document.body.style.overflow = 'hidden'

  // iOS Safari ignores `overflow: hidden` on the body for touch scrolling.
  if (isIOS) {
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 1) return
      if (event.target instanceof Element && scrollsItself(event.target)) return
      if (event.cancelable) event.preventDefault()
    }
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    stopTouchMove = () => document.removeEventListener('touchmove', onTouchMove)
  }

  // After DismissableLayer has recorded the body's own pointer-events.
  void nextTick(() => {
    if (lockers.size === 0) return
    document.body.style.pointerEvents = 'none'
    document.body.style.overflow = 'hidden'
  })
}

function unlock(): void {
  document.body.style.paddingRight = ''
  document.body.style.pointerEvents = ''
  document.documentElement.style.removeProperty('--scrollbar-width')
  document.body.style.overflow = initialOverflow ?? ''
  stopTouchMove?.()
  stopTouchMove = undefined
  initialOverflow = undefined
}

function scrollsItself(el: Element): boolean {
  const style = getComputedStyle(el)
  if (
    style.overflowX === 'scroll' ||
    style.overflowY === 'scroll' ||
    (style.overflowX === 'auto' && el.clientWidth < el.scrollWidth) ||
    (style.overflowY === 'auto' && el.clientHeight < el.scrollHeight)
  ) {
    return true
  }
  const parent = el.parentNode
  return parent instanceof Element && parent.tagName !== 'BODY' && scrollsItself(parent)
}

/**
 * Locks page scroll while any caller holds a lock. Nested overlays share one
 * lock: the page unlocks when the last of them releases.
 *
 * Returns a setter; the lock is also released when the calling component
 * unmounts.
 */
export function useBodyScrollLock(initial: boolean): (locked: boolean) => void {
  const id = Symbol('scroll-lock')
  const set = (locked: boolean) => {
    if (!isClient) return
    const wasLocked = lockers.size > 0
    if (locked) lockers.add(id)
    else lockers.delete(id)
    const isLocked = lockers.size > 0
    if (isLocked && !wasLocked) lock()
    if (!isLocked && wasLocked) unlock()
  }
  set(initial)
  if (getCurrentInstance()) onBeforeUnmount(() => set(false))
  return set
}
