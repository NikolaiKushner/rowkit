import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import Button from '../Button/Button.vue'
import Field from '../Field/Field.vue'
import Input from '../Input/Input.vue'
import Dialog from './Dialog.vue'
import DialogBody from './DialogBody.vue'
import DialogContent from './DialogContent.vue'
import DialogDescription from './DialogDescription.vue'
import DialogFooter from './DialogFooter.vue'
import DialogHeader from './DialogHeader.vue'
import DialogTitle from './DialogTitle.vue'
import DialogTrigger from './DialogTrigger.vue'

const sizes = ['sm', 'md', 'lg'] as const

const parts = {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  Button,
}

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
    components: parts,
    setup: () => ({ args, open: ref(false), body }),
    template: `
      <Dialog v-model:open="open">
        <DialogTrigger as-child>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent :size="args.size" :prevent-close="args.preventClose">
          <DialogHeader>
            <DialogTitle>{{ args.title }}</DialogTitle>
            <DialogDescription v-if="args.description">{{ args.description }}</DialogDescription>
          </DialogHeader>
          <DialogBody>{{ body }}</DialogBody>
          <DialogFooter>
            <Button variant="ghost" @click="open = false">Cancel</Button>
            <Button @click="open = false">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

/** Open by default — the frame visual QA and portfolio shots actually need. */
export const Open: Story = {
  render: () => ({
    components: parts,
    setup: () => ({ open: ref(true) }),
    template: `
      <div class="min-h-[28rem]">
        <Dialog v-model:open="open">
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete project</DialogTitle>
              <DialogDescription>
                This removes the project and everything in it. It cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>Downstream access is revoked immediately.</DialogBody>
            <DialogFooter>
              <Button variant="ghost" @click="open = false">Cancel</Button>
              <Button variant="destructive" @click="open = false">Delete project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    `,
  }),
}

/** Title alone. No `aria-describedby` is wired rather than a dangling one. */
export const TitleOnly: Story = {
  render: () =>
    withTrigger({ title: 'Rename project', size: 'sm' }, 'Choose a new name for this project.'),
}

export const Sizes: Story = {
  render: () => ({
    components: parts,
    setup: () => ({ sizes, openSize: ref<(typeof sizes)[number] | undefined>() }),
    template: `
      <div class="flex items-center gap-2">
        <Button v-for="size in sizes" :key="size" variant="outline" @click="openSize = size">
          {{ size }}
        </Button>
        <Dialog
          v-for="size in sizes"
          :key="size"
          :open="openSize === size"
          @update:open="openSize = undefined"
        >
          <DialogContent :size="size">
            <DialogHeader>
              <DialogTitle>Dialog at {{ size }}</DialogTitle>
            </DialogHeader>
            <DialogBody>
              Width is the only thing the preset changes. Height always follows the
              content, capped to the viewport.
            </DialogBody>
          </DialogContent>
        </Dialog>
      </div>
    `,
  }),
}

/** A form inside a dialog — the most common real use. */
export const WithForm: Story = {
  render: () => ({
    components: { ...parts, Field, Input },
    setup: () => ({ open: ref(false), name: ref('Platform') }),
    template: `
      <Dialog v-model:open="open">
        <DialogTrigger as-child>
          <Button>Rename project</Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>Everyone with access will see the new name.</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Field label="Project name" hint="Up to 60 characters.">
              <Input v-model="name" />
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" @click="open = false">Cancel</Button>
            <Button @click="open = false">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    `,
  }),
}

/**
 * Long content scrolls in the **body only**, so the footer actions stay put. A
 * dialog that scrolls as a whole pushes its own Save button off-screen.
 */
export const LongContent: Story = {
  render: () => ({
    components: parts,
    setup: () => ({ open: ref(false), lines: Array.from({ length: 40 }, (_, i) => i + 1) }),
    template: `
      <Dialog v-model:open="open">
        <DialogTrigger as-child>
          <Button>Open terms</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terms of service</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p v-for="line in lines" :key="line" class="mb-3">
              Clause {{ line }} — the header and footer stay fixed while this scrolls.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" @click="open = false">Decline</Button>
            <Button @click="open = false">Accept</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

/** The header is composed. The accessible name still comes from `DialogTitle`. */
export const CustomHeader: Story = {
  render: () => ({
    components: parts,
    setup: () => ({ open: ref(false) }),
    template: `
      <Dialog v-model:open="open">
        <DialogTrigger as-child>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader class="border-b border-border-subtle pb-4">
            <span class="text-xs font-medium uppercase tracking-wide text-primary-on-subtle">
              Billing
            </span>
            <DialogTitle>Upgrade plan</DialogTitle>
          </DialogHeader>
          <DialogBody>The accessible name is still "Upgrade plan", from the title.</DialogBody>
          <DialogFooter>
            <Button @click="open = false">Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
    components: { ...parts, Field, Input },
    setup: () => ({ open: ref(true), name: ref('Platform') }),
    template: `
      <Dialog v-model:open="open">
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Project settings</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Field label="Project name"><Input v-model="name" /></Field>
          </DialogBody>
          <DialogFooter><Button>Save</Button></DialogFooter>
        </DialogContent>
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
    components: parts,
    setup: () => ({ open: ref(false), lines: Array.from({ length: 60 }, (_, i) => i + 1) }),
    template: `
      <div>
        <Dialog v-model:open="open">
          <DialogTrigger as-child>
            <Button>Open over a long page</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Scroll lock check</DialogTitle>
            </DialogHeader>
            <DialogBody>
              Compare the page edges behind the scrim before and after opening.
            </DialogBody>
          </DialogContent>
        </Dialog>
        <p v-for="line in lines" :key="line" class="text-sm text-muted-foreground">
          Page line {{ line }} — the page must not shift sideways when the dialog opens.
        </p>
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
