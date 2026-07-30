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
 * Reka wraps the viewport in a `role="region"` landmark carrying the F8 hotkey
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
      // Reka binds F8 to move focus into the toast region — a real keyboard
      // affordance, and the label is how anyone discovers it.
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
      ['success', 'bg-success-subtle'],
      ['warning', 'bg-warning-subtle'],
      ['danger', 'bg-danger-subtle'],
    ] as const)('%s uses the %s token', async (variant, expected) => {
      await setup()
      api[variant]('Message')
      await nextTick()
      expect(document.body.innerHTML).toContain(expected)
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
})
