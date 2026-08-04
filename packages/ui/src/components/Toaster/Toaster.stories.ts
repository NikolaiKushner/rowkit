import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { onUnmounted } from 'vue'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import Button from '../Button/Button.vue'
import { useToast } from '../../composables/useToast'
import Toaster from './Toaster.vue'

const positions = ['top-right', 'top-center', 'bottom-right', 'bottom-center'] as const

/**
 * Controls declared explicitly rather than inferred, so the docs table shows
 * the public API instead of Vue's internal slot machinery.
 */
interface ToasterArgs {
  position: (typeof positions)[number]
  max: number
}

/**
 * Every story clears the queue on unmount. The queue is module-level by design,
 * so it outlives a story otherwise and leaks into the next one.
 */
function scene(template: string, setup: () => Record<string, unknown> = () => ({})) {
  return {
    components: { Toaster, Button },
    setup: () => {
      const api = useToast()
      api.dismissAll()
      onUnmounted(() => {
        api.dismissAll()
      })
      return { ...api, ...setup() }
    },
    template,
  }
}

const meta: Meta<ToasterArgs> = {
  title: 'Overlay/Toaster',
  component: Toaster,
  tags: ['autodocs'],
  args: { position: 'bottom-right', max: 3 },
  parameters: {
    a11y: {
      config: {
        rules: [
          /**
           * Reka's toast viewport renders focus guards — `aria-hidden` spans
           * with `tabindex="0"` — to catch Tab and route it into the toast
           * region for the F8 flow. They are focusable by necessity and hidden
           * from assistive technology by necessity, which is exactly what
           * `aria-hidden-focus` forbids.
           *
           * The guard only becomes focusable while toasts exist, so it is
           * inert the rest of the time. rowkit cannot reach the element to fix
           * it, and rebuilding the viewport to avoid it is what hard rule 2
           * exists to prevent. Disabled for this component only, and only this
           * rule — worth reporting upstream and removing when fixed.
           */
          { id: 'aria-hidden-focus', enabled: false },
        ],
      },
    },
  },
  argTypes: {
    position: { control: 'inline-radio', options: positions },
    max: { control: { type: 'number', min: 1, max: 5 } },
  },
  render: (args) => ({
    ...scene(
      `
      <div class="p-8">
        <Button @click="success('Project archived')">Show a toast</Button>
        <Toaster v-bind="args" />
      </div>
    `,
      () => ({ args })
    ),
  }),
}

export default meta
type Story = StoryObj<ToasterArgs>

export const Default: Story = {}

/** All four tones. Danger is styled loudly and still announced politely. */
export const Variants: Story = {
  render: () =>
    scene(`
      <div class="flex flex-wrap gap-2 p-8">
        <Button variant="secondary" @click="toast('Nothing special happened')">Neutral</Button>
        <Button variant="secondary" @click="success('Project archived')">Success</Button>
        <Button variant="secondary" @click="warning('Two seats left')">Warning</Button>
        <Button variant="secondary" @click="danger('Could not save')">Danger</Button>
        <Toaster />
      </div>
    `),
}

export const Positions: Story = {
  render: (args) => ({
    ...scene(
      `
      <div class="p-8">
        <Button @click="toast('Anchored to ' + args.position)">Show at {{ args.position }}</Button>
        <Toaster :position="args.position" />
      </div>
    `,
      () => ({ args })
    ),
  }),
}

/**
 * A toast with an action uses `duration: 0`. An undo that vanishes at its own
 * pace is worse than no undo — WCAG 2.2.1 is the formal version of that.
 */
export const WithAction: Story = {
  render: () =>
    scene(`
      <div class="p-8">
        <Button
          variant="danger"
          @click="danger('Project deleted', {
            duration: 0,
            action: { label: 'Undo', onClick: () => success('Restored') },
          })"
        >
          Delete project
        </Button>
        <Toaster />
      </div>
    `),
}

/** Beyond `max`, toasts wait their turn and enter as slots free up. */
export const QueueOverflow: Story = {
  render: () =>
    scene(`
      <div class="p-8">
        <Button
          @click="[1,2,3,4,5].forEach((n) => toast('Toast ' + n, { duration: 0 }))"
        >
          Fire five at once
        </Button>
        <p class="mt-2 text-sm text-muted-foreground">
          Three show; dismiss one and the next appears.
        </p>
        <Toaster :max="3" />
      </div>
    `),
}

/** Auto-dismiss, verified against the real primitive rather than a fake clock. */
export const AutoDismisses: Story = {
  render: () =>
    scene(`
      <div class="p-8">
        <Button @click="toast('Gone shortly', { duration: 400 })">Show a brief toast</Button>
        <Toaster />
      </div>
    `),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Show a brief toast' }))
    await expect(await body.findByText('Gone shortly')).toBeInTheDocument()

    await waitFor(() => expect(body.queryByText('Gone shortly')).toBeNull(), { timeout: 3000 })
  },
}

/**
 * Hovering pauses that toast's countdown. Dismissal mid-read is the classic
 * toast failure, and this is Reka's `ToastRoot` doing it — not a timer of ours.
 */
export const HoverPauses: Story = {
  render: () =>
    scene(`
      <div class="p-8">
        <Button @click="toast('Hover me to keep me', { duration: 600 })">Show a toast</Button>
        <Toaster />
      </div>
    `),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Show a toast' }))
    const toast = await body.findByText('Hover me to keep me')

    await userEvent.hover(toast)
    // Comfortably past the duration; it survives because the pointer is on it.
    await new Promise((resolve) => setTimeout(resolve, 1200))
    await expect(toast).toBeInTheDocument()

    await userEvent.unhover(toast)
    await waitFor(() => expect(body.queryByText('Hover me to keep me')).toBeNull(), {
      timeout: 3000,
    })
  },
}

/** A duplicate fired twice in quick succession is one toast, not two. */
export const DuplicatesCoalesce: Story = {
  render: () =>
    scene(`
      <div class="p-8">
        <Button @click="toast('Saved', { duration: 0 }); toast('Saved', { duration: 0 })">
          Fire the same toast twice
        </Button>
        <Toaster />
      </div>
    `),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Fire the same toast twice' }))

    await expect(await body.findAllByText('Saved')).toHaveLength(1)
  },
}

/** Toasts never steal focus, and the region is reachable on purpose. */
export const DoesNotStealFocus: Story = {
  render: () =>
    scene(`
      <div class="p-8">
        <Button @click="toast('Saved', { duration: 0 })">Show a toast</Button>
        <Toaster />
      </div>
    `),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Show a toast' })
    const body = within(document.body)

    await userEvent.click(trigger)
    await body.findByText('Saved')

    // Focus stays where the user left it — a toast is not an interruption.
    await expect(trigger).toHaveFocus()
    await expect(body.queryByRole('alert')).toBeNull()
  },
}
