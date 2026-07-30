import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import Tooltip from './Tooltip.vue'

const content = 'Archive this project'

async function setup(props: Record<string, unknown> = {}, trigger = '<button>Archive</button>') {
  const el = mount(Tooltip, {
    props: { content, ...props },
    slots: { default: trigger },
    attachTo: document.body,
  })
  await nextTick()
  return el
}

const triggerEl = () => document.querySelector<HTMLElement>('button')

/**
 * Reka renders two things: the styled bubble, and a visually-hidden `role=
 * "tooltip"` span inside it that `aria-describedby` points at. The split is
 * deliberate — the visible text is a plain text node, so a screen reader gets
 * the description once rather than announcing a nested tooltip as well.
 */
const description = () => {
  const id = triggerEl()?.getAttribute('aria-describedby')
  return id === null || id === undefined ? null : document.getElementById(id)
}

/** The styled, positioned bubble: the description's own parent. */
const bubble = () => description()?.parentElement ?? null

/** Real focus, so `document.activeElement` assertions mean something. */
async function focusTrigger(): Promise<void> {
  triggerEl()?.focus()
  await nextTick()
  await nextTick()
}

describe('Tooltip', () => {
  describe('the trigger', () => {
    it('does not wrap the trigger in an extra element', async () => {
      // `as-child` matters: a wrapper span changes layout and breaks the
      // disabled-button pattern the docs recommend.
      await setup()
      const button = document.querySelector('button')
      expect(button?.parentElement?.tagName).not.toBe('SPAN')
      expect(button?.textContent).toBe('Archive')
    })

    it('renders no tooltip until asked', async () => {
      await setup()
      expect(description()).toBeNull()
    })
  })

  describe('opening', () => {
    it('opens on keyboard focus, not hover alone', async () => {
      // A hover-only tooltip is invisible to keyboard users.
      await setup()
      await focusTrigger()
      expect(bubble()?.textContent).toContain(content)
    })

    it('stays shut when disabled', async () => {
      await setup({ disabled: true })
      await focusTrigger()
      expect(description()).toBeNull()
    })
  })

  describe('the trigger describes itself with the tooltip', () => {
    it('wires aria-describedby while open', async () => {
      await setup()
      await focusTrigger()
      expect(triggerEl()?.getAttribute('aria-describedby')).toBeTruthy()
      expect(description()?.getAttribute('role')).toBe('tooltip')
      expect(description()?.textContent).toContain(content)
    })
  })

  describe('dismissing', () => {
    it('closes on Escape without moving focus', async () => {
      // WCAG 1.4.13: dismissable without disturbing what the user was doing.
      await setup()
      await focusTrigger()
      expect(bubble()).not.toBeNull()

      const before = document.activeElement
      expect(before).toBe(triggerEl())

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      await nextTick()
      await nextTick()

      expect(bubble()).toBeNull()
      // Dismissing must not disturb what the user was doing.
      expect(document.activeElement).toBe(before)
    })
  })

  describe('placement', () => {
    it.each(['top', 'right', 'bottom', 'left'] as const)(
      'honours %s as a preference',
      async (placement) => {
        await setup({ placement })
        await focusTrigger()
        // Reka records the *resolved* side, which may differ from the preference
        // near a viewport edge — that flip is the wanted behaviour. jsdom has no
        // layout, so nothing collides and the preference is what lands.
        expect(bubble()?.getAttribute('data-side')).toBe(placement)
      }
    )
  })

  describe('motion', () => {
    it('gates every animation behind motion-safe', async () => {
      await setup()
      await focusTrigger()
      for (const token of (bubble()?.className ?? '').split(/\s+/)) {
        if (!token.includes('animate-')) continue
        expect(token, 'tooltip motion is ambient and must be gated').toContain('motion-safe:')
      }
    })
  })

  describe('content is a string, deliberately', () => {
    it('renders the content as text', async () => {
      // The type forbids markup; this pins the runtime behaviour to match, so
      // an accidental v-html could not slip in unnoticed.
      await setup({ content: '<em>not markup</em>' })
      await focusTrigger()
      expect(bubble()?.querySelector('em')).toBeNull()
      expect(bubble()?.textContent).toContain('<em>not markup</em>')
    })
  })
})
