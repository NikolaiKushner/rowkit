import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import Button from '../Button/Button.vue'
import Field from '../Field/Field.vue'
import Input from '../Input/Input.vue'
import Dialog from './Dialog.vue'

const sizes = ['sm', 'md', 'lg'] as const

/**
 * Controls declared explicitly rather than inferred, so the docs table shows
 * the public API instead of Vue's internal slot machinery.
 */
interface DialogArgs {
  title: string
  description?: string
  size: (typeof sizes)[number]
  preventClose: boolean
}

/** The dialog is controlled, so every story needs somewhere to keep `open`. */
function withTrigger(args: Partial<DialogArgs>, body = 'Body copy goes here.') {
  return {
    components: { Dialog, Button },
    setup: () => ({ args, open: ref(false), body }),
    template: `
      <div>
        <Button @click="open = true">Open dialog</Button>
        <Dialog v-bind="args" v-model:open="open">
          {{ body }}
          <template #footer>
            <Button variant="ghost" @click="open = false">Cancel</Button>
            <Button @click="open = false">Confirm</Button>
          </template>
        </Dialog>
      </div>
    `,
  }
}

const meta: Meta<DialogArgs> = {
  title: 'Overlay/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: {
    title: 'Delete project',
    description: 'This removes the project and everything in it. It cannot be undone.',
    size: 'md',
    preventClose: false,
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    size: { control: 'inline-radio', options: sizes },
    preventClose: { control: 'boolean' },
  },
  render: (args) => withTrigger(args),
}

export default meta
type Story = StoryObj<DialogArgs>

export const Default: Story = {}

/** Title alone. No `aria-describedby` is wired rather than a dangling one. */
export const TitleOnly: Story = {
  render: () =>
    withTrigger({ title: 'Rename project', size: 'sm' }, 'Choose a new name for this project.'),
}

export const Sizes: Story = {
  render: () => ({
    components: { Dialog, Button },
    setup: () => ({ sizes, openSize: ref<(typeof sizes)[number] | undefined>() }),
    template: `
      <div class="flex items-center gap-2">
        <Button v-for="size in sizes" :key="size" variant="secondary" @click="openSize = size">
          {{ size }}
        </Button>
        <Dialog
          v-for="size in sizes"
          :key="size"
          :size="size"
          :title="'Dialog at ' + size"
          :open="openSize === size"
          @update:open="openSize = undefined"
        >
          Width is the only thing the preset changes. Height always follows the
          content, capped to the viewport.
        </Dialog>
      </div>
    `,
  }),
}

/** A form inside a dialog — the most common real use. */
export const WithForm: Story = {
  render: () => ({
    components: { Dialog, Button, Field, Input },
    setup: () => ({ open: ref(false), name: ref('Platform') }),
    template: `
      <div>
        <Button @click="open = true">Rename project</Button>
        <Dialog
          v-model:open="open"
          title="Rename project"
          description="Everyone with access will see the new name."
          size="sm"
        >
          <Field label="Project name" hint="Up to 60 characters.">
            <Input v-model="name" />
          </Field>
          <template #footer>
            <Button variant="ghost" @click="open = false">Cancel</Button>
            <Button @click="open = false">Save</Button>
          </template>
        </Dialog>
      </div>
    `,
  }),
}

/**
 * Long content scrolls in the **body only**, so the footer actions stay put. A
 * dialog that scrolls as a whole pushes its own Save button off-screen.
 */
export const LongContent: Story = {
  render: () => ({
    components: { Dialog, Button },
    setup: () => ({ open: ref(false), lines: Array.from({ length: 40 }, (_, i) => i + 1) }),
    template: `
      <div>
        <Button @click="open = true">Open terms</Button>
        <Dialog v-model:open="open" title="Terms of service" size="md">
          <p v-for="line in lines" :key="line" class="mb-3">
            Clause {{ line }} — the header and footer stay fixed while this scrolls.
          </p>
          <template #footer>
            <Button variant="ghost" @click="open = false">Decline</Button>
            <Button @click="open = false">Accept</Button>
          </template>
        </Dialog>
      </div>
    `,
  }),
}

/**
 * `preventClose` blocks Escape and the scrim, for a flow where dismissing by
 * accident loses work. **The close button stays** — a dialog with no exit is
 * hostile.
 */
export const PreventClose: Story = {
  args: { preventClose: true, title: 'Unsaved changes' },
  render: (args) =>
    withTrigger(args, 'Escape and clicking outside do nothing. The close button still works.'),
}

/**
 * Replacing the header. The `title` prop still supplies the accessible name, so
 * customising the presentation cannot break the contract.
 */
export const CustomHeader: Story = {
  render: () => ({
    components: { Dialog, Button },
    setup: () => ({ open: ref(false) }),
    template: `
      <div>
        <Button @click="open = true">Open</Button>
        <Dialog v-model:open="open" title="Upgrade plan">
          <template #header>
            <div class="flex flex-col gap-1 border-b border-border-subtle pb-4">
              <span class="text-xs font-medium uppercase tracking-wide text-primary-on-subtle">
                Billing
              </span>
              <h2 class="text-lg font-semibold text-foreground">Upgrade plan</h2>
            </div>
          </template>
          The accessible name is still "Upgrade plan", from the prop.
          <template #footer>
            <Button @click="open = false">Done</Button>
          </template>
        </Dialog>
      </div>
    `,
  }),
}

/** The accessible contract: named, described, and modal. */
export const Accessibility: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }))

    const body = within(document.body)
    const dialog = await body.findByRole('dialog', { name: 'Delete project' })
    await expect(dialog).toBeInTheDocument()

    const describedBy = dialog.getAttribute('aria-describedby')
    await expect(document.getElementById(describedBy ?? '')).toHaveTextContent('cannot be undone')

    // Focus moved into the dialog, not left behind on the trigger.
    await expect(dialog.contains(document.activeElement)).toBe(true)
  },
}

/**
 * The focus ring of the last field is not clipped by the scrolling body.
 *
 * The body is `overflow-y-auto`, which makes it a clipping boundary, and the
 * ring is drawn 3px outside the control's border box. With no vertical padding
 * the bottom of that ring was sliced off: the field looked focused on three
 * sides and cut on the fourth, and nothing about the markup was wrong.
 */
export const FocusRingIsNotClipped: Story = {
  render: () => ({
    components: { Dialog, Button, Field, Input },
    setup: () => ({ open: ref(true), name: ref('Platform') }),
    template: `
      <Dialog v-model:open="open" title="Project settings" size="sm">
        <Field label="Project name"><Input v-model="name" /></Field>
        <template #footer><Button>Save</Button></template>
      </Dialog>
    `,
  }),
  play: async () => {
    const body = within(document.body)
    const dialog = await body.findByRole('dialog')

    const input = dialog.querySelector('input')
    if (!input) throw new Error('no input rendered')
    input.focus()

    // The scrolling region is the element that clips. Walk up from the field.
    let region: HTMLElement | null = input.parentElement
    while (region && getComputedStyle(region).overflowY !== 'auto') region = region.parentElement
    if (!region) throw new Error('no scrolling body found')

    const RING = 3
    const field = input.getBoundingClientRect()
    const clip = region.getBoundingClientRect()

    // Measured, not inferred from the class list: a padding utility that failed
    // to compile would leave the classes correct and the ring still cut.
    await expect(field.bottom + RING).toBeLessThanOrEqual(clip.bottom)
    await expect(field.top - RING).toBeGreaterThanOrEqual(clip.top)
  },
}

/** Escape closes, and focus returns to the trigger that opened it. */
export const EscapeRestoresFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Open dialog' })

    await userEvent.click(trigger)
    await within(document.body).findByRole('dialog')

    await userEvent.keyboard('{Escape}')

    await expect(within(document.body).queryByRole('dialog')).toBeNull()
    // Losing the trigger on close is the classic focus bug.
    await expect(trigger).toHaveFocus()
  },
}

/**
 * Tab cycles inside the dialog and cannot reach the page behind it.
 *
 * A focus trap that stops trapping is invisible: the dialog still looks modal,
 * and a keyboard user simply tabs out into content the scrim says is
 * unavailable, then operates it. Nothing about the rendered output changes when
 * this breaks, which is why it is asserted rather than assumed.
 */
export const TabIsTrapped: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Open dialog' })
    await userEvent.click(trigger)

    const body = within(document.body)
    const dialog = await body.findByRole('dialog')

    // Tab far enough to have escaped several times over if it could.
    for (let i = 0; i < 12; i++) {
      await userEvent.tab()
      await expect(dialog.contains(document.activeElement)).toBe(true)
    }

    // Backwards too — a trap that only holds in one direction is still broken.
    for (let i = 0; i < 12; i++) {
      await userEvent.tab({ shift: true })
      await expect(dialog.contains(document.activeElement)).toBe(true)
    }

    // The trigger sits behind the scrim, so it must never take focus while open.
    await expect(trigger).not.toHaveFocus()
  },
}

/** Tab visits every control in the dialog, then wraps to the first. */
export const TabCyclesThroughControls: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }))

    const body = within(document.body)
    const dialog = await body.findByRole('dialog')

    const focusable = [...dialog.querySelectorAll<HTMLElement>('button, [href], input, select')]
    await expect(focusable.length).toBeGreaterThan(1)

    // Walking one full lap must return focus to where the lap started.
    const start = document.activeElement
    for (let i = 0; i < focusable.length; i++) await userEvent.tab()
    await expect(document.activeElement).toBe(start)
  },
}

/** With `preventClose`, Escape does nothing and the close button still works. */
export const PreventCloseIsNotATrap: Story = {
  args: { preventClose: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }))

    const body = within(document.body)
    await body.findByRole('dialog')

    await userEvent.keyboard('{Escape}')
    await expect(body.queryByRole('dialog')).not.toBeNull()

    await userEvent.click(body.getByRole('button', { name: 'Close dialog' }))
    await expect(body.queryByRole('dialog')).toBeNull()
  },
}

/**
 * Scroll lock, and the trap the spec warns about: locking scroll by removing the
 * scrollbar shifts the page sideways on any platform with a visible scrollbar.
 * macOS overlay scrollbars hide the bug completely, so this story exists to be
 * looked at somewhere else.
 */
export const ScrollLock: Story = {
  render: () => ({
    components: { Dialog, Button },
    setup: () => ({ open: ref(false), lines: Array.from({ length: 60 }, (_, i) => i + 1) }),
    template: `
      <div>
        <Button @click="open = true">Open over a long page</Button>
        <p v-for="line in lines" :key="line" class="text-sm text-muted-foreground">
          Page line {{ line }} — the page must not shift sideways when the dialog opens.
        </p>
        <Dialog v-model:open="open" title="Scroll lock check">
          Compare the page edges behind the scrim before and after opening.
        </Dialog>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const widthBefore = document.documentElement.clientWidth

    await userEvent.click(canvas.getByRole('button', { name: 'Open over a long page' }))
    await within(document.body).findByRole('dialog')

    // The measurable half of the check. The visual half needs a real scrollbar.
    await expect(document.documentElement.clientWidth).toBe(widthBefore)
  },
}
