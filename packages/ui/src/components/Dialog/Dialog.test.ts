import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import Dialog from './Dialog.vue'
import DialogBody from './DialogBody.vue'
import DialogContent from './DialogContent.vue'
import DialogDescription from './DialogDescription.vue'
import DialogFooter from './DialogFooter.vue'
import DialogHeader from './DialogHeader.vue'
import DialogTitle from './DialogTitle.vue'

const title = 'Delete project'

/**
 * The public API is the parts, so the tests compose them the way a consumer
 * does. The dialog teleports only after mount, so querying synchronously finds
 * an empty document.
 */
const Harness = defineComponent({
  components: {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogBody,
    DialogFooter,
  },
  props: {
    open: { type: Boolean, default: true },
    title: { type: String, default: title },
    description: { type: String, default: undefined },
    size: { type: String, default: 'md' },
    preventClose: { type: Boolean, default: false },
    surfaceClass: { type: String, default: undefined },
    eyebrow: { type: String, default: undefined },
  },
  emits: ['update:open'],
  template: `
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
      <DialogContent :size="size" :prevent-close="preventClose" :class="surfaceClass">
        <DialogHeader>
          <slot name="header">
            <span v-if="eyebrow">{{ eyebrow }}</span>
            <DialogTitle>{{ title }}</DialogTitle>
            <DialogDescription v-if="description">{{ description }}</DialogDescription>
          </slot>
        </DialogHeader>
        <DialogBody><slot /></DialogBody>
        <DialogFooter v-if="$slots.footer"><slot name="footer" /></DialogFooter>
      </DialogContent>
    </Dialog>
  `,
})

async function setup(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  const el = mount(Harness, {
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

/** Dispatched from inside the dialog, the way a real keypress originates. */
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
      // The dialog is made modal by hiding siblings rather than by setting
      // `aria-modal`, which is the more robust of the two — `aria-modal` alone
      // is inconsistently honoured.
      await setup()
      // `data-aria-hidden` marks what hideOthers hid.
      const hidden = document.querySelector('[data-aria-hidden]')
      expect(hidden).not.toBeNull()
      expect(hidden?.getAttribute('aria-hidden')).toBe('true')
    })

    it('portals to the body rather than rendering in place', async () => {
      // Inline rendering breaks the moment an ancestor has overflow or transform.
      await setup()
      expect(dialog()?.parentElement).toBe(document.body)
    })

    it('renders the body', async () => {
      await setup()
      expect(text()).toContain('Body copy')
    })

    it('renders no footer unless given one', async () => {
      await setup()
      expect(text()).not.toContain('Confirm')
    })

    it('renders the footer', async () => {
      await setup({}, { footer: '<button>Confirm</button>' })
      expect(text()).toContain('Confirm')
    })
  })

  describe('accessible name and description', () => {
    it('names the dialog from DialogTitle', async () => {
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

    it('keeps the name when the header is composed around the title', async () => {
      await setup({ eyebrow: 'Billing' })
      const labelledBy = dialog()?.getAttribute('aria-labelledby')
      expect(document.getElementById(labelledBy ?? '')?.textContent).toContain(title)
      expect(text()).toContain('Billing')
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

      it('keeps the close button outside the header', async () => {
        await setup({ preventClose: true, eyebrow: 'Billing' })
        expect(closeButton()).not.toBeNull()
        expect(closeButton()?.closest('[data-slot="dialog-header"]')).toBeNull()
      })
    })
  })

  describe('layout', () => {
    it('scrolls the body, not the whole dialog', async () => {
      // A dialog that scrolls as a whole pushes its own footer actions offscreen.
      await setup({}, { footer: '<button>Save</button>' })
      const scroller = document.querySelector('[role="dialog"] .overflow-y-auto')
      expect(scroller?.textContent).toContain('Body copy')
      expect(scroller?.textContent).not.toContain('Save')
    })

    it.each([
      ['sm', 'max-w-[320px]'],
      ['md', 'max-w-[440px]'],
      ['lg', 'max-w-[600px]'],
    ] as const)('%s maps to %s', async (size, expected) => {
      await setup({ size })
      expect(dialog()?.className).toContain(expected)
    })
  })

  describe('focus on open', () => {
    it('goes to the first control after the title bar, not the close button', async () => {
      await setup({}, { default: '<input aria-label="Name" />' })
      await nextTick()
      expect(document.activeElement?.getAttribute('aria-label')).toBe('Name')
    })

    it('goes to the default button when the footer leads with it', async () => {
      await setup({}, { footer: '<button>OK</button><button>Cancel</button>' })
      await nextTick()
      expect(document.activeElement?.textContent).toBe('OK')
    })

    it('falls back to the close button when there is nothing else', async () => {
      await setup()
      await nextTick()
      expect(document.activeElement).toBe(closeButton())
    })
  })

  describe('title bar', () => {
    it('puts the close button in the title bar, outside the header', async () => {
      await setup({ eyebrow: 'Billing' })
      const bar = document.querySelector('[data-slot="dialog-title-bar"]')
      expect(bar?.contains(closeButton())).toBe(true)
      expect(bar?.closest('[data-slot="dialog-header"]')).toBeNull()
    })

    it('turns inactive while another dialog is open above it', async () => {
      const Nested = defineComponent({
        components: { Dialog, DialogContent, DialogHeader, DialogTitle },
        props: { inner: { type: Boolean, default: false } },
        // Opened in the same tick as the outer dialog, the inner one must
        // still not be hidden from assistive technology by it.
        template: `
          <Dialog :open="true">
            <DialogContent data-testid="outer">
              <DialogHeader><DialogTitle>Outer</DialogTitle></DialogHeader>
              <Dialog :open="inner">
                <DialogContent data-testid="inner">
                  <DialogHeader><DialogTitle>Inner</DialogTitle></DialogHeader>
                </DialogContent>
              </Dialog>
            </DialogContent>
          </Dialog>
        `,
      })
      const el = mount(Nested, { attachTo: document.body })
      const outer = () => document.querySelector('[data-testid="outer"]')
      const inner = () => document.querySelector('[data-testid="inner"]')
      await nextTick()
      await nextTick()
      expect(outer()?.hasAttribute('data-inactive')).toBe(false)

      await el.setProps({ inner: true })
      await nextTick()
      await nextTick()
      expect(outer()?.hasAttribute('data-inactive')).toBe(true)
      expect(inner()?.hasAttribute('data-inactive')).toBe(false)
      expect(inner()?.closest('[aria-hidden="true"]')).toBeNull()

      await el.setProps({ inner: false })
      await nextTick()
      await nextTick()
      expect(outer()?.hasAttribute('data-inactive')).toBe(false)
      el.unmount()
    })

    it('opens and closes instantly, over no backdrop', async () => {
      // Windows 98 has no window animation and draws nothing behind a
      // dialog: the layer behind it only catches clicks.
      await setup()
      const overlay = document.querySelector('[data-slot="dialog-overlay"]')
      expect(dialog()?.className).not.toContain('animate-')
      expect(overlay?.className).not.toContain('animate-')
      expect(overlay?.className).not.toMatch(/\bbg-/)
    })
  })

  it('merges a consumer class onto the surface', async () => {
    await setup({ surfaceClass: 'max-w-[300px]' })
    const className = dialog()?.className ?? ''
    expect(className).toContain('max-w-[300px]')
    expect(className).not.toContain('max-w-[440px]')
  })
})
