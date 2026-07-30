import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import Dialog from './Dialog.vue'

const title = 'Delete project'

/**
 * Async because Reka defers the teleport: the portal target is resolved after
 * mount so the same component can render on a server. Querying synchronously
 * finds an empty document.
 */
async function setup(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  const el = mount(Dialog, {
    props: { title, open: true, ...props },
    slots: { default: 'Body copy', ...slots },
    attachTo: document.body,
  })
  await nextTick()
  await nextTick()
  return el
}

/** The dialog portals to `<body>`, so queries go through the document. */
const dialog = () => document.querySelector('[role="dialog"]')
const closeButton = () => document.querySelector<HTMLElement>('[aria-label="Close dialog"]')
const text = () => document.body.textContent ?? ''

/** Reka listens on the layer, so the event has to originate inside it. */
function pressEscape(): void {
  dialog()?.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
  )
}

describe('Dialog', () => {
  describe('rendering', () => {
    it('renders nothing while closed', async () => {
      await setup({ open: false })
      expect(dialog()).toBeNull()
    })

    it('renders a dialog when open', async () => {
      await setup()
      expect(dialog()).not.toBeNull()
      expect(dialog()?.getAttribute('role')).toBe('dialog')
    })

    it('hides the rest of the page from assistive technology', async () => {
      // Reka makes the dialog modal by hiding siblings rather than by setting
      // `aria-modal`, which is the more robust of the two — `aria-modal` alone
      // is inconsistently honoured.
      await setup()
      // `data-aria-hidden` is Reka's own marker for what it hid.
      const hidden = document.querySelector('[data-aria-hidden]')
      expect(hidden).not.toBeNull()
      expect(hidden?.getAttribute('aria-hidden')).toBe('true')
    })

    it('portals to the body rather than rendering in place', async () => {
      // Inline rendering breaks the moment an ancestor has overflow or transform.
      await setup()
      expect(dialog()?.parentElement).toBe(document.body)
    })

    it('renders the body slot', async () => {
      await setup()
      expect(text()).toContain('Body copy')
    })

    it('renders no footer unless given one', async () => {
      await setup()
      expect(text()).not.toContain('Confirm')
    })

    it('renders the footer slot', async () => {
      await setup({}, { footer: '<button>Confirm</button>' })
      expect(text()).toContain('Confirm')
    })
  })

  describe('accessible name and description', () => {
    it('always names the dialog from the title prop', async () => {
      await setup()
      const labelledBy = dialog()?.getAttribute('aria-labelledby')
      expect(labelledBy).toBeTruthy()
      expect(document.getElementById(labelledBy ?? '')?.textContent).toContain(title)
    })

    it('wires a description when one is given', async () => {
      await setup({ description: 'This cannot be undone.' })
      const describedBy = dialog()?.getAttribute('aria-describedby')
      expect(document.getElementById(describedBy ?? '')?.textContent).toContain(
        'This cannot be undone.'
      )
    })

    it('references no description when there is none', async () => {
      // A dangling aria-describedby is announced as a blank by some readers.
      await setup()
      expect(dialog()?.getAttribute('aria-describedby')).toBe('')
    })

    it('keeps the name when the header slot replaces the visible title', async () => {
      // The whole reason `title` is a prop and not only a slot.
      await setup({}, { header: '<h2>Custom header</h2>' })
      const labelledBy = dialog()?.getAttribute('aria-labelledby')
      expect(document.getElementById(labelledBy ?? '')?.textContent).toContain(title)
      expect(text()).toContain('Custom header')
    })
  })

  describe('closing', () => {
    it('emits on close-button activation', async () => {
      const el = await setup()
      closeButton()?.click()
      await nextTick()
      expect(el.emitted('update:open')?.at(-1)).toEqual([false])
    })

    it('emits on Escape', async () => {
      const el = await setup()
      pressEscape()
      await nextTick()
      expect(el.emitted('update:open')?.at(-1)).toEqual([false])
    })

    describe('preventClose', () => {
      it('blocks Escape', async () => {
        const el = await setup({ preventClose: true })
        pressEscape()
        await nextTick()
        expect(el.emitted('update:open')).toBeUndefined()
      })

      it('never removes the close button', async () => {
        // A dialog with no exit is hostile. preventClose hardens accidental
        // dismissal, not intentional exit.
        const el = await setup({ preventClose: true })
        expect(closeButton()).not.toBeNull()
        closeButton()?.click()
        await nextTick()
        expect(el.emitted('update:open')?.at(-1)).toEqual([false])
      })

      it('still leaves the close button when the header is replaced', async () => {
        await setup({ preventClose: true }, { header: '<h2>Custom</h2>' })
        expect(closeButton()).not.toBeNull()
      })
    })
  })

  describe('layout', () => {
    it('scrolls the body, not the whole dialog', async () => {
      // A dialog that scrolls as a whole pushes its own footer actions offscreen.
      await setup({}, { footer: '<button>Save</button>' })
      const scroller = document.querySelector('[role="dialog"] .overflow-y-auto')
      expect(scroller?.textContent).toContain('Body copy')
    })

    it.each([
      ['sm', 'sm:max-w-sm'],
      ['md', 'sm:max-w-lg'],
      ['lg', 'sm:max-w-2xl'],
    ] as const)('%s maps to %s', async (size, expected) => {
      await setup({ size })
      expect(dialog()?.className).toContain(expected)
    })
  })

  it('gates enter and exit behind motion-safe', async () => {
    // Overlay transitions are ambient — they carry no information, so they
    // collapse to instant for anyone who asked for reduced motion.
    await setup()
    for (const token of (dialog()?.className ?? '').split(/\s+/)) {
      if (!token.includes('animate-')) continue
      expect(token, 'every overlay animation is gated').toContain('motion-safe:')
    }
  })

  it('merges a consumer class onto the surface', async () => {
    await setup({ class: 'sm:max-w-xs' })
    const className = dialog()?.className ?? ''
    expect(className).toContain('sm:max-w-xs')
    expect(className).not.toContain('sm:max-w-lg')
  })
})
