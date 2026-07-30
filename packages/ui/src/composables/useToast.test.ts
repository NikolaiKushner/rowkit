import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useToast } from './useToast'

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
      // Same message, but far enough apart not to coalesce.
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

    it('does not run a queued toast down while it waits', () => {
      // A toast counting down off screen would arrive already half-expired.
      api.setMax(1)
      api.toast('Visible', { duration: 1000 })
      api.toast('Waiting', { duration: 1000 })

      vi.advanceTimersByTime(1000)
      expect(messages()).toEqual(['Waiting'])

      // Its own full duration starts when it appears, not before.
      vi.advanceTimersByTime(999)
      expect(messages()).toEqual(['Waiting'])
      vi.advanceTimersByTime(1)
      expect(messages()).toEqual([])
    })
  })

  describe('auto-dismiss', () => {
    it('dismisses after the default duration', () => {
      api.toast('Saved')
      vi.advanceTimersByTime(4999)
      expect(messages()).toEqual(['Saved'])
      vi.advanceTimersByTime(1)
      expect(messages()).toEqual([])
    })

    it('honours a custom duration', () => {
      api.toast('Quick', { duration: 100 })
      vi.advanceTimersByTime(100)
      expect(messages()).toEqual([])
    })
  })

  describe('rule 3 — hover pauses the hovered toast', () => {
    it('holds the toast while paused', () => {
      // Dismissal mid-read is the classic toast failure.
      const id = api.toast('Read me', { duration: 1000 })
      vi.advanceTimersByTime(600)

      api.pause(id)
      vi.advanceTimersByTime(10_000)
      expect(messages()).toEqual(['Read me'])
    })

    it('resumes with the time that was left, not the full duration', () => {
      const id = api.toast('Read me', { duration: 1000 })
      vi.advanceTimersByTime(600)
      api.pause(id)
      api.resume(id)

      vi.advanceTimersByTime(399)
      expect(messages()).toEqual(['Read me'])
      vi.advanceTimersByTime(1)
      expect(messages()).toEqual([])
    })

    it('pauses only the hovered one', () => {
      // Freezing the queue would let one hover hold everything on screen.
      const first = api.toast('Hovered', { duration: 1000 })
      api.toast('Not hovered', { duration: 1000 })

      api.pause(first)
      vi.advanceTimersByTime(1000)
      expect(messages()).toEqual(['Hovered'])
    })
  })

  describe('rule 4 — duration 0 never auto-dismisses', () => {
    it('stays until dismissed', () => {
      // For a danger toast with an undo: an action that vanishes at its own pace
      // is worse than no action.
      api.toast('Deleted', { duration: 0, action: { label: 'Undo', onClick: () => undefined } })
      vi.advanceTimersByTime(60_000)
      expect(messages()).toEqual(['Deleted'])
    })

    it('still dismisses on request', () => {
      const id = api.toast('Deleted', { duration: 0 })
      api.dismiss(id)
      expect(messages()).toEqual([])
    })

    it('does not block the queue behind it', () => {
      api.setMax(1)
      const sticky = api.toast('Sticky', { duration: 0 })
      api.toast('Next', { duration: 100 })

      vi.advanceTimersByTime(10_000)
      expect(messages()).toEqual(['Sticky'])

      api.dismiss(sticky)
      expect(messages()).toEqual(['Next'])
    })
  })

  describe('rule 5 — a duplicate inside the window is coalesced', () => {
    it('does not stack an identical message fired twice', () => {
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

  describe('dismissAll', () => {
    it('clears the queue and its timers', () => {
      api.toast('One')
      api.toast('Two')
      api.dismissAll()
      expect(api.items.value).toEqual([])

      // No stray timer firing into an empty queue.
      expect(() => {
        vi.advanceTimersByTime(10_000)
      }).not.toThrow()
      expect(api.items.value).toEqual([])
    })
  })

  describe('dismissing an unknown id', () => {
    it('is a no-op rather than an error', () => {
      api.toast('Saved')
      expect(() => {
        api.dismiss('rk-toast-nope')
      }).not.toThrow()
      expect(api.items.value).toHaveLength(1)
    })
  })
})
