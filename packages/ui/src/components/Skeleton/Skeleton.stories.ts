import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import Skeleton from './Skeleton.vue'

const variants = ['text', 'circle', 'rect'] as const

/**
 * Controls declared explicitly rather than inferred, so the docs table shows
 * the public API instead of Vue's internal slot machinery.
 */
interface SkeletonArgs {
  variant: (typeof variants)[number]
  lines: number
  animated: boolean
  label?: string
}

const meta: Meta<SkeletonArgs> = {
  title: 'Data/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    variant: 'text',
    lines: 1,
    animated: true,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    lines: { control: { type: 'number', min: 1, max: 6 } },
    animated: { control: 'boolean' },
    label: { control: 'text' },
  },
  render: (args) => ({
    components: { Skeleton },
    setup: () => ({ args }),
    template: `<div class="w-80"><Skeleton v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<SkeletonArgs>

export const Default: Story = {}

/** The three geometries. */
export const Variants: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex w-80 flex-col gap-4">
        <div class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide text-text-muted">text</span>
          <Skeleton variant="text" />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide text-text-muted">circle</span>
          <Skeleton variant="circle" />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide text-text-muted">rect</span>
          <Skeleton variant="rect" class="h-24" />
        </div>
      </div>
    `,
  }),
}

/** The last bar is shortened so a stack reads as prose rather than as a table. */
export const Paragraph: Story = {
  args: { lines: 4 },
}

/**
 * Static, for `prefers-reduced-motion`. The pulse is suppressed automatically
 * for those users — this story is for seeing the resting state deliberately.
 */
export const Static: Story = {
  args: { animated: false, lines: 3 },
}

/**
 * Composing the primitives into the shape of the content being waited for.
 * This is what a skeleton is for: a placeholder that does not match the layout
 * it replaces produces exactly the jump it was meant to prevent.
 */
export const CardPlaceholder: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex w-96 gap-4 rounded-lg border border-border bg-surface p-4">
        <Skeleton variant="circle" />
        <div class="flex flex-1 flex-col gap-2">
          <Skeleton class="w-1/3" />
          <Skeleton :lines="2" />
        </div>
      </div>
    `,
  }),
}

/**
 * A loading table. One label for the whole region, not one per cell — a reader
 * should hear "Loading users" once rather than thirty times.
 */
export const TablePlaceholder: Story = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div role="status" aria-busy="true" aria-label="Loading users" class="w-full max-w-md">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="border-b border-border text-left">
              <th class="p-2 font-medium text-text-muted">User</th>
              <th class="p-2 font-medium text-text-muted">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in 5" :key="row" class="border-b border-border-subtle">
              <td class="p-2"><Skeleton /></td>
              <td class="p-2"><Skeleton class="w-16" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  }),
}

/**
 * The primary behaviour worth testing is the accessibility contract: silent by
 * default, and a single busy region when labelled.
 */
export const Labelled: Story = {
  args: { label: 'Loading users', lines: 3 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const region = canvas.getByRole('status', { name: 'Loading users' })
    await expect(region).toHaveAttribute('aria-busy', 'true')

    // The bars inside carry no separate announcement of their own.
    await expect(region.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0)
    await expect(region).not.toHaveAttribute('aria-hidden')
  },
}

/** Unlabelled, the placeholder is invisible to assistive technology. */
export const Decorative: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('status')).toBeNull()
    await expect(canvasElement.querySelector('[aria-hidden="true"]')).not.toBeNull()
  },
}
