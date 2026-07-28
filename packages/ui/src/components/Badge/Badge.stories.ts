import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Badge from './Badge.vue'

const variants = ['neutral', 'primary', 'success', 'warning', 'danger'] as const
const appearances = ['subtle', 'solid', 'outline'] as const

/**
 * Storybook derives arg types from the component, which drags Vue's internal
 * slot machinery into every story signature. Declaring the controls explicitly
 * keeps the stories readable and is what the docs table renders from.
 */
interface BadgeArgs {
  variant: (typeof variants)[number]
  appearance: (typeof appearances)[number]
  size: 'sm' | 'md'
  dot: boolean
}

const meta: Meta<BadgeArgs> = {
  title: 'Foundations/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    variant: 'neutral',
    appearance: 'subtle',
    size: 'md',
    dot: false,
  },
  argTypes: {
    variant: { control: 'select', options: variants },
    appearance: { control: 'select', options: appearances },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    dot: { control: 'boolean' },
  },
  render: (args) => ({
    components: { Badge },
    setup: () => ({ args }),
    template: `<Badge v-bind="args">Active</Badge>`,
  }),
}

export default meta
type Story = StoryObj<BadgeArgs>

export const Default: Story = {}

/** Every variant against every appearance — the full colour matrix. */
export const Matrix: Story = {
  render: () => ({
    components: { Badge },
    setup: () => ({ variants, appearances }),
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="appearance in appearances" :key="appearance" class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide text-text-muted">{{ appearance }}</span>
          <div class="flex flex-wrap items-center gap-2">
            <Badge v-for="variant in variants" :key="variant" :variant="variant" :appearance="appearance">
              {{ variant }}
            </Badge>
          </div>
        </div>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="flex items-center gap-2">
        <Badge size="sm" variant="success">sm</Badge>
        <Badge size="md" variant="success">md</Badge>
      </div>
    `,
  }),
}

/**
 * The dot gives the eye a shape to lock onto when a column repeats the same
 * few statuses hundreds of times.
 */
export const WithDot: Story = {
  render: () => ({
    components: { Badge },
    setup: () => ({ variants }),
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <Badge v-for="variant in variants" :key="variant" :variant="variant" dot>{{ variant }}</Badge>
      </div>
    `,
  }),
}

/** Long content truncates rather than stretching the row it sits in. */
export const Truncates: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div class="w-40">
        <Badge variant="warning">Pending verification from the billing provider</Badge>
      </div>
    `,
  }),
}

/** What a status column actually looks like. */
export const InATable: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <table class="w-full max-w-md border-collapse text-sm">
        <thead>
          <tr class="border-b border-border text-left">
            <th class="p-2 font-medium text-text-muted">User</th>
            <th class="p-2 font-medium text-text-muted">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-border-subtle">
            <td class="p-2 text-text">ada@example.com</td>
            <td class="p-2"><Badge variant="success" dot>Active</Badge></td>
          </tr>
          <tr class="border-b border-border-subtle">
            <td class="p-2 text-text">grace@example.com</td>
            <td class="p-2"><Badge variant="warning" dot>Invited</Badge></td>
          </tr>
          <tr>
            <td class="p-2 text-text">alan@example.com</td>
            <td class="p-2"><Badge variant="danger" dot>Suspended</Badge></td>
          </tr>
        </tbody>
      </table>
    `,
  }),
}
