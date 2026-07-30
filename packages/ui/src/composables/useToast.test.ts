import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useToast } from './useToast'

/**
 * These cover the **queue**: how many are visible, what waits, what coalesces.
 *
 * Countdown, hover-pause and swipe-to-dismiss are Reka's `ToastRoot`, so they
 * are verified in `Toaster.stories.ts` against the real primitive rather than
 * re-asserted against an implementation this file no longer has.
 *
 * Fake timers are here only so `Date.now()` can be advanced past the coalescing
 * window.
 */
const api = useToast()

beforeEach(() => {
  vi.useFakeTimers()
  api.dismissAll()
  api.setMax(3)
})

afterEach(() => {
  api.dismissAll()
  vi.useRealTimers()
})

const messages = () => api.visible.value.map((item) => item.message)

describe('useToast', () => {
  describe('the API', () => {
    it('returns an id', () => {
      expect(api.toast('Saved')).toMatch(/^rk-toast-/)
    })

    it('gives each toast a distinct id', () => {
      const first = api.toast('Saved')
      vi.advanceTimersByTime(400)
      expect(api.toast('Saved')).not.toBe(first)
    })

    it('defaults to the neutral tone', () => {
      api.toast('Saved')
      expect(api.visible.value[0]?.variant).toBe('neutral')
    })

    it.each(['success', 'warning', 'danger'] as const)('%s sets its own tone', (variant) => {
      api[variant]('Message')
      expect(api.visible.value[0]?.variant).toBe(variant)
    })

    it('defaults the duration, and passes a custom one through', () => {
      api.toast('Default')
      expect(api.visible.value[0]?.duration).toBe(5000)

      api.dismissAll()
      api.toast('Custom', { duration: 0 })
      expect(api.visible.value[0]?.duration).toBe(0)
    })

    it('carries an action through', () => {
      const onClick = vi.fn()
      api.toast('Deleted', { action: { label: 'Undo', onClick } })
      api.visible.value[0]?.action?.onClick()
      expect(onClick).toHaveBeenCalledOnce()
    })

    it('omits the action entirely when there is none', () => {
      api.toast('Saved')
      expect(api.visible.value[0]?.action).toBeUndefined()
    })
  })

  describe('rule 1 — at most `max` visible, overflow waits FIFO', () => {
    it('shows only up to the limit', () => {
      for (const n of [1, 2, 3, 4, 5]) api.toast(`Toast ${String(n)}`)
      expect(api.visible.value).toHaveLength(3)
      expect(api.items.value).toHaveLength(5)
      expect(messages()).toEqual(['Toast 1', 'Toast 2', 'Toast 3'])
    })

    it('promotes the next in line when one is dismissed', () => {
      for (const n of [1, 2, 3, 4]) api.toast(`Toast ${String(n)}`)
      api.dismiss(api.visible.value[0]?.id ?? '')
      expect(messages()).toEqual(['Toast 2', 'Toast 3', 'Toast 4'])
    })

    it('keeps waiting toasts in the queue, not on screen', () => {
      // A queued toast has no `ToastRoot` until it is visible, which is what
      // stops it counting down before anyone has seen it.
      api.setMax(1)
      api.toast('Visible')
      api.toast('Waiting')
      expect(messages()).toEqual(['Visible'])
      expect(api.items.value.map((item) => item.message)).toEqual(['Visible', 'Waiting'])
    })

    it('honours a different limit', () => {
      api.setMax(1)
      api.toast('First')
      api.toast('Second')
      expect(messages()).toEqual(['First'])
    })

    it('never drops below one visible', () => {
      api.setMax(0)
      api.toast('Still shown')
      expect(api.visible.value).toHaveLength(1)
    })
  })

  describe('rule 4 — duration 0 never auto-dismisses', () => {
    it('records the intent for the renderer to honour', () => {
      // `Toaster` maps 0 to Infinity on ToastRoot. For a danger toast with an
      // undo: an action that vanishes at its own pace is worse than no action.
      api.toast('Deleted', { duration: 0, action: { label: 'Undo', onClick: () => undefined } })
      expect(api.visible.value[0]?.duration).toBe(0)
    })

    it('still dismisses on request', () => {
      const id = api.toast('Deleted', { duration: 0 })
      api.dismiss(id)
      expect(messages()).toEqual([])
    })

    it('does not block the queue behind it', () => {
      api.setMax(1)
      const sticky = api.toast('Sticky', { duration: 0 })
      api.toast('Next')

      expect(messages()).toEqual(['Sticky'])
      api.dismiss(sticky)
      expect(messages()).toEqual(['Next'])
    })
  })

  describe('rule 5 — a duplicate inside the window is coalesced', () => {
    it('does not stack an identical message fired twice', () => {
      // Double-fired handlers are common; stacking makes the UI look broken.
      const first = api.toast('Saved')
      const second = api.toast('Saved')
      expect(second).toBe(first)
      expect(api.items.value).toHaveLength(1)
    })

    it('stacks the same message again once the window has passed', () => {
      api.toast('Saved')
      vi.advanceTimersByTime(301)
      api.toast('Saved')
      expect(api.items.value).toHaveLength(2)
    })

    it('leaves different messages alone', () => {
      api.toast('Saved')
      api.toast('Deleted')
      expect(api.items.value).toHaveLength(2)
    })
  })

  describe('dismissing', () => {
    it('clears everything on dismissAll', () => {
      api.toast('One')
      api.toast('Two')
      api.dismissAll()
      expect(api.items.value).toEqual([])
    })

    it('treats an unknown id as a no-op', () => {
      api.toast('Saved')
      expect(() => {
        api.dismiss('rk-toast-nope')
      }).not.toThrow()
      expect(api.items.value).toHaveLength(1)
    })
  })
})
