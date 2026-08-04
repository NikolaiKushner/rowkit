import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { TooltipProvider } from 'reka-ui'
import { expect, userEvent, within } from 'storybook/test'
import Button from '../Button/Button.vue'
import Tooltip from './Tooltip.vue'

const placements = ['top', 'right', 'bottom', 'left'] as const

/**
 * Controls declared explicitly rather than inferred, so the docs table shows
 * the public API instead of Vue's internal slot machinery.
 */
interface TooltipArgs {
  content: string
  placement: (typeof placements)[number]
  delay: number
  disabled: boolean
}

const meta: Meta<TooltipArgs> = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    content: 'Archive this project',
    placement: 'top',
    delay: 300,
    disabled: false,
  },
  argTypes: {
    content: { control: 'text' },
    placement: { control: 'inline-radio', options: placements },
    delay: { control: { type: 'number', min: 0, max: 1000, step: 50 } },
    disabled: { control: 'boolean' },
  },
  render: (args) => ({
    components: { Tooltip, Button },
    setup: () => ({ args }),
    // Padding, because the tooltip needs somewhere to go in the story frame.
    template: `
      <div class="flex items-center justify-center p-16">
        <Tooltip v-bind="args">
          <Button variant="secondary">Archive</Button>
        </Tooltip>
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<TooltipArgs>

export const Default: Story = {}

/** `placement` is a preference. Near a viewport edge it flips automatically. */
export const Placements: Story = {
  render: () => ({
    components: { Tooltip, Button },
    setup: () => ({ placements }),
    template: `
      <div class="flex items-center justify-center gap-3 p-16">
        <Tooltip
          v-for="placement in placements"
          :key="placement"
          :placement="placement"
          :content="'Opens on the ' + placement"
        >
          <Button variant="secondary">{{ placement }}</Button>
        </Tooltip>
      </div>
    `,
  }),
}

/**
 * An icon-only button is the case tooltips exist for — but the tooltip is **not**
 * the accessible name. The button carries its own `aria-label`; the tooltip is
 * the visible echo of it for sighted pointer users.
 */
export const IconButton: Story = {
  render: () => ({
    components: { Tooltip, Button },
    template: `
      <div class="flex items-center justify-center p-16">
        <Tooltip content="Archive project">
          <Button variant="ghost" aria-label="Archive project">
            <svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 6h14M5 6v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6M8 9h4"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </Button>
        </Tooltip>
      </div>
    `,
  }),
}

/**
 * A toolbar sweep. Mount a `TooltipProvider` and `skipDelayDuration` lets the
 * pointer move between adjacent triggers without paying the delay again — the
 * one behaviour a per-instance tooltip cannot give you, because the grace period
 * is shared state.
 */
export const ToolbarWithProvider: Story = {
  render: () => ({
    components: { Tooltip, Button, TooltipProvider },
    setup: () => ({ actions: ['Bold', 'Italic', 'Underline', 'Strikethrough'] }),
    template: `
      <TooltipProvider :delay-duration="300" :skip-delay-duration="500">
        <div class="flex items-center justify-center gap-1 p-16">
          <Tooltip v-for="action in actions" :key="action" :content="action">
            <Button variant="ghost" size="sm" :aria-label="action">
              {{ action.charAt(0) }}
            </Button>
          </Tooltip>
        </div>
      </TooltipProvider>
    `,
  }),
}

/** No delay at all, for a tooltip on something the user is already looking at. */
export const NoDelay: Story = {
  args: { delay: 0 },
}

/** Off without unwrapping the trigger, so layout does not shift. */
export const Disabled: Story = {
  args: { disabled: true, content: 'You will not see this' },
}

/**
 * **The disabled-button trap.** A `disabled` element fires no pointer or focus
 * events, so a tooltip on one never opens — the single most-asked tooltip
 * question in every library's issues.
 *
 * Use `aria-disabled` and handle the no-op yourself. The control stays
 * focusable, so the tooltip can explain *why* it is unavailable, which is
 * precisely when the user needs it most.
 */
export const DisabledTriggerPattern: Story = {
  render: () => ({
    components: { Tooltip, Button },
    template: `
      <div class="flex items-center justify-center gap-6 p-16">
        <div class="flex flex-col items-center gap-2">
          <Tooltip content="Never appears">
            <Button disabled>Truly disabled</Button>
          </Tooltip>
          <span class="text-xs text-muted-foreground">✗ no events, no tooltip</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <Tooltip content="Upgrade your plan to export">
            <Button aria-disabled="true" variant="secondary">Export</Button>
          </Tooltip>
          <span class="text-xs text-muted-foreground">✓ aria-disabled, tooltip works</span>
        </div>
      </div>
    `,
  }),
}

/** Long text wraps and is width-capped. Past a line or two, it is not a tooltip. */
export const LongContent: Story = {
  args: {
    content:
      'Archiving hides the project from the list but keeps every record, so it can be restored later.',
  },
}

/** Opens on keyboard focus, not hover alone. */
export const OpensOnFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Archive' })

    trigger.focus()

    const body = within(document.body)
    await expect(await body.findByRole('tooltip', { hidden: true })).toHaveTextContent(
      'Archive this project'
    )
    // The trigger points at it, which is what a screen reader reads.
    await expect(trigger).toHaveAttribute('aria-describedby')
  },
}

/** Escape dismisses it, and focus stays exactly where it was (WCAG 1.4.13). */
export const EscapeDismisses: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Archive' })
    const body = within(document.body)

    trigger.focus()
    await body.findByRole('tooltip', { hidden: true })

    await userEvent.keyboard('{Escape}')

    await expect(body.queryByRole('tooltip', { hidden: true })).toBeNull()
    await expect(trigger).toHaveFocus()
  },
}

/** Hovering opens it too, after the delay. */
export const OpensOnHover: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    await userEvent.hover(canvas.getByRole('button', { name: 'Archive' }))

    await expect(await body.findByRole('tooltip', { hidden: true })).toHaveTextContent(
      'Archive this project'
    )
  },
}
