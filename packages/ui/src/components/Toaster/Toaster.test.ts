import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useToast } from '../../composables/useToast'
import Toaster from './Toaster.vue'

const api = useToast()

async function setup(props: Record<string, unknown> = {}) {
  const el = mount(Toaster, { props, attachTo: document.body })
  await nextTick()
  await nextTick()
  return el
}

/**
 * The viewport sits inside a `role="region"` landmark carrying the F8 hotkey
 * label; the `<ol>` inside it is the styled viewport. They are different
 * elements and only the inner one has our classes.
 */
const viewport = () => document.querySelector('ol')
const landmark = () => document.querySelector('[role="region"]')
const text = () => document.body.textContent ?? ''

beforeEach(() => {
  api.dismissAll()
  api.setMax(3)
})

afterEach(() => {
  api.dismissAll()
})

describe('Toaster', () => {
  describe('the viewport', () => {
    it('mounts even with nothing queued', async () => {
      // A live region added at the same moment as its content is frequently not
      // announced, so it exists from the start.
      await setup()
      expect(viewport()).not.toBeNull()
    })

    it('portals to the body', async () => {
      await setup()
      // Inline rendering would put the stack inside whatever laid it out.
      expect(landmark()?.parentElement).toBe(document.body)
    })

    it('names the region, including the hotkey that focuses it', async () => {
      // F8 moves focus into the toast region — a real keyboard affordance, and
      // the label is how anyone discovers it.
      await setup()
      expect(landmark()?.getAttribute('aria-label')).toContain('F8')
    })

    it.each([
      ['top-right', 'top-0'],
      ['bottom-center', 'bottom-0'],
    ] as const)('%s anchors with %s', async (position, expected) => {
      await setup({ position })
      expect(viewport()?.className).toContain(expected)
    })

    it('lets clicks through the gaps between toasts', async () => {
      // The stack spans a corner of the screen; without this the page under it
      // is unclickable.
      await setup()
      expect(viewport()?.className).toContain('pointer-events-none')
    })
  })

  describe('rendering the queue', () => {
    it('renders a queued toast', async () => {
      await setup()
      api.toast('Project archived')
      await nextTick()
      expect(text()).toContain('Project archived')
    })

    it('renders only up to max', async () => {
      await setup({ max: 2 })
      for (const n of [1, 2, 3]) api.toast(`Toast ${String(n)}`)
      await nextTick()
      expect(text()).toContain('Toast 1')
      expect(text()).toContain('Toast 2')
      expect(text()).not.toContain('Toast 3')
    })

    it('promotes a waiting toast once one is dismissed', async () => {
      await setup({ max: 1 })
      api.toast('First')
      api.toast('Second')
      await nextTick()
      expect(text()).not.toContain('Second')

      api.dismiss(api.visible.value[0]?.id ?? '')
      await nextTick()
      expect(text()).toContain('Second')
    })

    it('passes max down to the queue', async () => {
      await setup({ max: 1 })
      api.toast('One')
      api.toast('Two')
      expect(api.visible.value).toHaveLength(1)
    })
  })

  describe('tone', () => {
    it.each([
      ['toast', 'RkInfoIcon'],
      ['success', 'RkSuccessIcon'],
      ['warning', 'RkWarningIcon'],
      ['danger', 'RkErrorIcon'],
    ] as const)('%s shows its icon on the shared silver face', async (method, icon) => {
      const wrapper = await setup()
      api[method]('Message')
      await nextTick()
      expect(wrapper.findComponent({ name: icon }).exists()).toBe(true)
      const toast = document.querySelector('[data-slot="toast"]')
      expect(toast?.classList.contains('bg-card')).toBe(true)
      expect(toast?.classList.contains('shadow-window')).toBe(true)
    })

    it('shows a bold title above the message', async () => {
      await setup()
      api.toast("We'll email you when the CSV is ready.", { title: 'Export started' })
      await nextTick()
      const title = document.querySelector('[data-slot="toast-title"]')
      expect(title?.textContent?.trim()).toBe('Export started')
      expect(title?.classList.contains('font-strong')).toBe(true)
    })

    it('keeps a danger toast until it is closed', () => {
      api.danger('Could not save')
      expect(api.items.value.at(-1)?.duration).toBe(0)
    })

    it('still lets a danger toast set its own duration', () => {
      api.danger('Could not save', { duration: 4000 })
      expect(api.items.value.at(-1)?.duration).toBe(4000)
    })
  })

  describe('accessibility', () => {
    it('announces politely, even for danger', async () => {
      // An assertive region interrupts whatever the reader is saying. That is
      // for emergencies, not for "could not save".
      await setup()
      api.danger('Could not save')
      await nextTick()
      expect(document.querySelector('[role="alert"]')).toBeNull()
    })

    it('does not move focus when a toast arrives', async () => {
      await setup()
      const before = document.activeElement
      api.toast('Saved')
      await nextTick()
      expect(document.activeElement).toBe(before)
    })

    it('gives every toast a close button', async () => {
      await setup()
      api.toast('Saved')
      await nextTick()
      expect(document.querySelector('[aria-label="Dismiss"]')).not.toBeNull()
    })

    it('renders an action with alt text for screen readers', async () => {
      await setup()
      api.toast('Deleted', { duration: 0, action: { label: 'Undo', onClick: () => undefined } })
      await nextTick()
      expect(text()).toContain('Undo')
    })
  })

  describe('dismissing', () => {
    it('removes the toast from the queue when closed', async () => {
      await setup()
      api.toast('Saved')
      await nextTick()

      const close = document.querySelector<HTMLElement>('[aria-label="Dismiss"]')
      close?.click()
      await nextTick()

      expect(api.items.value).toHaveLength(0)
    })

    it('runs the action handler', async () => {
      const onClick = vi.fn()
      await setup()
      api.toast('Deleted', { duration: 0, action: { label: 'Undo', onClick } })
      await nextTick()
      // Vue ignores an event in the same millisecond its listener was attached,
      // and the action is a Button rendered a moment ago. No person clicks that
      // fast; a test does.
      await new Promise((resolve) => setTimeout(resolve, 2))

      const action = [...document.querySelectorAll('button')].find(
        (button) => button.textContent?.trim() === 'Undo'
      )
      action?.click()
      await nextTick()

      expect(onClick).toHaveBeenCalledOnce()
    })
  })

  describe('motion', () => {
    it('gates every animation behind motion-safe', async () => {
      await setup()
      api.toast('Saved')
      await nextTick()
      for (const token of document.body.innerHTML.split(/[\s"]+/)) {
        if (!token.includes('animate-toast')) continue
        expect(token, 'toast motion is ambient and must be gated').toContain('motion-safe:')
      }
    })
  })

  it('merges a consumer class onto the viewport', async () => {
    await setup({ class: 'max-w-md' })
    expect(viewport()?.className).toContain('max-w-md')
  })

  describe('keyboard', () => {
    const escape = (target: EventTarget = document.body) =>
      target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    it('ignores Escape pressed outside the toast region', async () => {
      // Escape elsewhere belongs to whatever the user is in — a dialog, a menu.
      await setup()
      api.toast('Saved', { duration: 0 })
      await nextTick()
      escape()
      await nextTick()
      expect(api.items.value).toHaveLength(1)
    })

    it('closes the toast that holds focus on Escape', async () => {
      await setup()
      api.toast('First', { duration: 0 })
      api.toast('Second', { duration: 0 })
      await nextTick()
      const second = [...document.querySelectorAll<HTMLElement>('[data-slot="toast"]')].find((el) =>
        el.textContent?.includes('Second')
      )
      second?.focus()
      escape(second)
      await nextTick()
      expect(api.items.value.map((item) => item.message)).toEqual(['First'])
    })

    it('moves focus into the region on F8', async () => {
      await setup()
      api.toast('Saved', { duration: 0 })
      await nextTick()
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'F8' }))
      expect(document.activeElement).toBe(viewport())
    })

    it('puts the newest toast first, so Tab and reading order start there', async () => {
      await setup()
      api.toast('Older', { duration: 0 })
      await new Promise((resolve) => setTimeout(resolve, 350))
      api.toast('Newer', { duration: 0 })
      await nextTick()
      const order = [...document.querySelectorAll('[data-slot="toast"]')].map((el) =>
        el.textContent?.trim().slice(0, 5)
      )
      expect(order).toEqual(['Newer', 'Older'])
    })
  })

  describe('announcing', () => {
    it('writes into a polite status region that exists before any toast', async () => {
      await setup()
      const region = document.querySelector('[role="status"][aria-live="polite"]')
      expect(region).not.toBeNull()

      api.toast('Project archived')
      await vi.waitFor(() => expect(region?.textContent).toContain('Project archived'))
      expect(region?.textContent).toContain('Notification')
    })
  })

  it('is a branch of open layers, so clicking a toast does not close a dialog', async () => {
    await setup()
    expect(landmark()?.hasAttribute('data-dismissable-layer-branch')).toBe(true)
  })
})
