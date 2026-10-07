import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import ProgressBar from './ProgressBar.vue'

/** Controls declared explicitly, so the docs table shows the public API. */
interface ProgressBarArgs {
  value: number | null
  max: number
}

const meta: Meta<ProgressBarArgs> = {
  title: 'Foundations/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  args: { value: 60, max: 100 },
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
  render: (args) => ({
    components: { ProgressBar },
    setup: () => ({ args }),
    template: `<div class="w-[200px]"><ProgressBar v-bind="args" aria-label="Copying files" /></div>`,
  }),
}

export default meta
type Story = StoryObj<ProgressBarArgs>

export const Default: Story = {}

/** The four states drawn in Figma: 0, 25, 60 and 100%. */
export const Values: Story = {
  render: () => ({
    components: { ProgressBar },
    setup: () => ({ values: [0, 25, 60, 100] }),
    template: `
      <div class="flex w-[200px] flex-col gap-3">
        <ProgressBar v-for="v in values" :key="v" :value="v" :aria-label="v + '%'" />
      </div>
    `,
  }),
}

/**
 * No value: the work has started but its size is unknown. A segment travels
 * along the track; with reduced motion it stands still at 40%.
 */
export const Indeterminate: Story = {
  render: () => ({
    components: { ProgressBar },
    template: `<div class="w-[200px]"><ProgressBar aria-label="Connecting" /></div>`,
  }),
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar', { name: 'Connecting' })
    await expect(bar).not.toHaveAttribute('aria-valuenow')
    await expect(bar).toHaveAttribute('data-state', 'indeterminate')
  },
}

/** Blocks are whole: at 100% of a 200px bar, 19 blocks, none cut off. */
export const BlocksAreWhole: Story = {
  render: () => ({
    components: { ProgressBar },
    template: `<div class="w-[200px]"><ProgressBar :value="100" aria-label="Done" /></div>`,
  }),
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar')
    const fill = bar.querySelector<HTMLElement>('[data-slot="progress-bar-fill"]')
    if (!fill) throw new Error('no fill')
    // 196px of track; whole 10px steps give 190px: 19 blocks and a 2px gap.
    await expect(fill.getBoundingClientRect().width % 10).toBe(0)
  },
}
