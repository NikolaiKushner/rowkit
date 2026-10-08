import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ConcreteComponent } from 'vue'
import { expect, userEvent, waitFor } from 'storybook/test'
import RawScrollArea from './ScrollArea.vue'
import { px } from '../../stories/token'

// ESLint cannot type a `.vue` import, so the component is given its shape here.
const ScrollArea = RawScrollArea as unknown as ConcreteComponent

/**
 * A region with Windows 98 scroll bars drawn by rowkit: the same in every
 * browser. The bars sit beside and below the content, never over it.
 */
const meta: Meta = {
  title: 'Foundations/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

const lines = Array.from({ length: 40 }, (_, i) => `Line ${String(i + 1)} of the event log.`)

/** The white well a list sits in, with the region inside it. */
const well = (attrs: string, size: string, content: string) => ({
  components: { ScrollArea },
  setup: () => ({ lines }),
  template: `
    <ScrollArea ${attrs} class="${size} bg-input p-0.5 text-ui text-foreground shadow-sunken">
      ${content}
    </ScrollArea>
  `,
})

const listContent = '<p v-for="line in lines" :key="line" class="m-0 px-1">{{ line }}</p>'
const wideContent =
  '<p v-for="line in lines" :key="line" class="m-0 w-[40rem] px-1">{{ line }} It runs on past the edge.</p>'

function parts(canvasElement: HTMLElement) {
  const root = canvasElement.querySelector<HTMLElement>('[data-slot="scroll-area"]')
  const viewport = canvasElement.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')
  if (!root || !viewport) throw new Error('no scroll area')
  const bar = (orientation: string) => {
    const el = root.querySelector<HTMLElement>(
      `[data-slot="scroll-area-scrollbar"][data-orientation="${orientation}"]`
    )
    if (!el) throw new Error(`no ${orientation} bar`)
    const [start, track, end] = Array.from(el.children) as HTMLElement[]
    if (!start || !track || !end) throw new Error('bar parts missing')
    return { el, start, track, end }
  }
  return { root, viewport, bar }
}

export const Default: Story = {
  render: () => well('label="Event log"', 'h-48 w-80', listContent),
  play: async ({ canvasElement }) => {
    const { root, viewport, bar } = parts(canvasElement)
    const vertical = bar('vertical')
    // The bar takes its own width (16px in Windows 98): the content is never under it.
    await expect(vertical.el.getBoundingClientRect().width).toBe(px('--spacing-scrollbar'))
    await expect(viewport.getBoundingClientRect().right).toBe(
      vertical.el.getBoundingClientRect().left
    )
    await expect(root.querySelector('[data-orientation="horizontal"]')).toBeNull()
    // Reachable from the keyboard, and named.
    await expect(viewport).toHaveAttribute('tabindex', '0')
    await expect(viewport).toHaveAccessibleName('Event log')
  },
}

/** Both bars, and the silver corner where they meet. */
export const BothDirections: Story = {
  render: () => well('label="Wide log"', 'h-48 w-80', wideContent),
}

/** `scrollbars="always"` with nothing to scroll: grey arrows, no thumb. */
export const AlwaysShown: Story = {
  render: () =>
    well(
      'label="Short log" scrollbars="always"',
      'h-32 w-60',
      '<p class="m-0 px-1">Only one line.</p>'
    ),
}

/** Fires a primary-button pointer event, the way a mouse would. */
function pointer(el: HTMLElement, type: 'pointerdown' | 'pointerup') {
  el.dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, pointerId: 1 }))
}

/** One click on an arrow scrolls one line, 16px; held, it shows pressed. */
export const ArrowScrollsALine: Story = {
  render: () => well('label="Event log"', 'h-48 w-80', listContent),
  play: async ({ canvasElement }) => {
    const { viewport, bar } = parts(canvasElement)
    const { end, start } = bar('vertical')
    pointer(end, 'pointerdown')
    await waitFor(() => expect(end).toHaveAttribute('data-pressed'))
    pointer(end, 'pointerup')
    await waitFor(() => expect(end).not.toHaveAttribute('data-pressed'))
    await expect(viewport.scrollTop).toBe(16)

    pointer(start, 'pointerdown')
    pointer(start, 'pointerup')
    await expect(viewport.scrollTop).toBe(0)
  },
}

/** A click on the track below the thumb scrolls a page: the viewport's height. */
export const TrackScrollsAPage: Story = {
  render: () => well('label="Event log"', 'h-48 w-80', listContent),
  play: async ({ canvasElement }) => {
    const { viewport, bar } = parts(canvasElement)
    const { track } = bar('vertical')
    const box = track.getBoundingClientRect()
    await userEvent.pointer([
      {
        keys: '[MouseLeft]',
        target: track,
        coords: { clientX: box.left + 8, clientY: box.bottom - 4 },
      },
    ])
    await expect(viewport.scrollTop).toBe(viewport.clientHeight)
  },
}

/** Dragging the thumb moves the content in proportion. */
export const ThumbDrags: Story = {
  render: () => well('label="Event log"', 'h-48 w-80', listContent),
  play: async ({ canvasElement }) => {
    const { viewport, bar } = parts(canvasElement)
    const thumb = bar('vertical').track.querySelector<HTMLElement>(
      '[data-slot="scroll-area-thumb"]'
    )
    if (!thumb) throw new Error('no thumb')
    const box = thumb.getBoundingClientRect()
    const x = box.left + 8
    const y = box.top + 4
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: thumb, coords: { clientX: x, clientY: y } },
      { target: thumb, coords: { clientX: x, clientY: y + 20 } },
      { keys: '[/MouseLeft]', target: thumb, coords: { clientX: x, clientY: y + 20 } },
    ])
    await expect(viewport.scrollTop).toBeGreaterThan(0)
    // The thumb followed the pointer, to the pixel.
    await waitFor(() => expect(Math.round(thumb.getBoundingClientRect().top - box.top)).toBe(20))
  },
}

/**
 * However the region scrolls — wheel, keyboard, script — the thumb follows.
 * Scrolled to the end, it sits at the end of the track.
 */
export const ThumbFollowsScroll: Story = {
  render: () => well('label="Event log"', 'h-48 w-80', listContent),
  play: async ({ canvasElement }) => {
    const { viewport, bar } = parts(canvasElement)
    viewport.scrollTop = viewport.scrollHeight
    const { track } = bar('vertical')
    await waitFor(async () => {
      const thumb = track.querySelector<HTMLElement>('[data-slot="scroll-area-thumb"]')
      if (!thumb) throw new Error('no thumb')
      await expect(Math.round(thumb.getBoundingClientRect().bottom)).toBe(
        Math.round(track.getBoundingClientRect().bottom)
      )
    })
  },
}
