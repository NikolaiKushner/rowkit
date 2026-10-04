import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import Button from './Button.vue'

const variants = ['default', 'secondary', 'ghost', 'destructive', 'link'] as const
const sizes = ['xs', 'sm', 'default', 'lg'] as const
const iconSizes = ['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const

interface ButtonArgs {
  variant: (typeof variants)[number]
  size: (typeof sizes)[number]
  block: boolean
  loading: boolean
  disabled: boolean
  /** Forwarded to the native button through fallthrough attributes. */
  onClick: (event: MouseEvent) => void
}

const meta: Meta<ButtonArgs> = {
  title: 'Foundations/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    size: 'default',
    loading: false,
    disabled: false,
    block: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'inline-radio', options: sizes },
  },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<Button v-bind="args">Save changes</Button>`,
  }),
}

export default meta
type Story = StoryObj<ButtonArgs>

export const Default: Story = {}

export const Variants: Story = {
  render: () => ({
    components: { Button },
    setup: () => ({ variants }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button v-for="variant in variants" :key="variant" :variant="variant">{{ variant }}</Button>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Button },
    setup: () => ({ sizes }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button v-for="size in sizes" :key="size" :size="size">{{ size }}</Button>
      </div>
    `,
  }),
}

export const IconSizes: Story = {
  render: () => ({
    components: { Button },
    setup: () => ({ iconSizes }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button
          v-for="size in iconSizes"
          :key="size"
          :size="size"
          variant="secondary"
          :aria-label="size"
        >
          <svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m7 5 5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </Button>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Button },
    setup: () => ({ variants }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button v-for="variant in variants" :key="variant" :variant="variant" disabled>{{ variant }}</Button>
      </div>
    `,
  }),
}

/**
 * The hourglass replaces the leading slot; the label stays and the button
 * keeps its place in the tab order. No spinner and no animation.
 */
export const Loading: Story = {
  render: () => ({
    components: { Button },
    setup: () => ({ variants: variants.filter((v) => v !== 'link') }),
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button v-for="variant in variants" :key="variant" :variant="variant" loading>{{ variant }}</Button>
      </div>
    `,
  }),
}

/**
 * A toggle: `pressed` sets `aria-pressed`, and on is drawn pressed in over the
 * dither. A toolbar of ghost toggles is the usual home.
 */
export const Toggle: Story = {
  render: () => ({
    components: { Button },
    setup() {
      const bold = ref(true)
      const italic = ref(false)
      return { bold, italic }
    },
    template: `
      <div class="flex items-center gap-3">
        <div class="flex">
          <Button variant="ghost" size="icon-sm" aria-label="Bold" :pressed="bold" @click="bold = !bold">
            <b>B</b>
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Italic" :pressed="italic" @click="italic = !italic">
            <i>I</i>
          </Button>
        </div>
        <Button variant="secondary" :pressed="bold" @click="bold = !bold">Word wrap</Button>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const bold = within(canvasElement).getByRole('button', { name: 'Bold' })
    await expect(bold).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(bold)
    await expect(bold).toHaveAttribute('aria-pressed', 'false')
  },
}

export const WithIcons: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button variant="secondary">
          <template #leading>
            <svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 5v10M5 10h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </template>
          Add user
        </Button>
        <Button variant="ghost">
          Next
          <template #trailing>
            <svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="m8 6 4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </template>
        </Button>
      </div>
    `,
  }),
}

export const Block: Story = {
  args: { block: true },
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<div class="w-80"><Button v-bind="args">Save changes</Button></div>`,
  }),
}

/** Rendered as a link. Disabled uses aria-disabled, since `<a>` has no `disabled`. */
export const AsLink: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <Button as="a" href="#" variant="secondary">Link button</Button>
        <Button as="a" href="#" variant="secondary" disabled>Disabled link</Button>
        <Button variant="link">Link variant</Button>
        <Button as-child variant="secondary"><a href="#">As child</a></Button>
      </div>
    `,
  }),
}

export const ClickFires: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button')
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

/**
 * The primary behaviour worth pinning: a loading button must not fire, and not
 * only because pointer events are off — the keyboard path has to be blocked too.
 */
export const LoadingBlocksActivation: Story = {
  args: { loading: true },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button')

    await expect(button).toHaveAttribute('aria-busy', 'true')
    // Still reachable: a control that leaves the tab order mid-request throws
    // keyboard focus back to the document body.
    await expect(button).not.toBeDisabled()

    button.focus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}
