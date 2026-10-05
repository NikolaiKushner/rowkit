import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'

/**
 * The Windows 98 scroll bar: the `scrollbar-win98` utility on an element that
 * scrolls. 16px thick, raised arrows, a dithered track and a raised thumb.
 * Chromium and Safari draw every part; Firefox only takes the colours.
 */
const meta: Meta = {
  title: 'Foundations/Scrollbar',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

const lines = Array.from(
  { length: 30 },
  (_, i) => `Line ${i + 1} — the scroll bar is the browser's own, restyled.`
)

/**
 * A white well with the region inside it. The bevel is on the wrapper: the
 * scroll bar paints over an inset shadow on the element that scrolls. The
 * region has to be reachable from the keyboard, so it takes focus.
 */
const region = (label: string, overflow: string, content: string) => ({
  setup: () => ({ lines, label, overflow }),
  template: `
    <div class="inline-block bg-input p-0.5 shadow-sunken">
      <div
        :class="['scrollbar-win98 px-1 text-ui text-foreground', overflow]"
        tabindex="0"
        role="region"
        :aria-label="label"
      >${content}</div>
    </div>
  `,
})

export const Vertical: Story = {
  render: () =>
    region(
      'Vertical',
      'h-48 w-80 overflow-y-scroll',
      '<p v-for="line in lines" :key="line" class="m-0">{{ line }}</p>'
    ),
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector<HTMLElement>('[role="region"]')!
    // The box has no border (the bevel is a shadow), so the gap between its
    // offset and client widths is the scroll bar alone. A native bar is 15px.
    await expect(el.offsetWidth - el.clientWidth).toBe(16)
  },
}

export const Horizontal: Story = {
  render: () =>
    region(
      'Horizontal',
      'w-80 overflow-x-scroll',
      '<p class="m-0 w-[48rem]">{{ lines[0] }} {{ lines[1] }} {{ lines[2] }}</p>'
    ),
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector<HTMLElement>('[role="region"]')!
    await expect(el.offsetHeight - el.clientHeight).toBe(16)
  },
}

/** Both bars, and the silver corner where they meet. */
export const Both: Story = {
  render: () =>
    region(
      'Both directions',
      'h-48 w-80 overflow-scroll',
      '<p v-for="line in lines" :key="line" class="m-0 w-[48rem]">{{ line }}</p>'
    ),
}

/** Nothing to scroll: grey arrows and no thumb. */
export const Disabled: Story = {
  render: () => region('Nothing to scroll', 'h-32 w-48 overflow-scroll', 'Short content.'),
}
