import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import Field from '../Field/Field.vue'
import Input from './Input.vue'

interface InputArgs {
  size: 'sm' | 'md' | 'lg'
  type: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number' | 'date'
  placeholder: string
  disabled: boolean
  invalid: boolean
  readonly: boolean
}

const meta: Meta<InputArgs> = {
  title: 'Foundations/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    size: 'md',
    type: 'text',
    placeholder: 'ada@example.com',
    disabled: false,
    invalid: false,
    readonly: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number', 'date'],
    },
  },
  render: (args) => ({
    components: { Field, Input },
    setup: () => ({ args, value: ref('') }),
    template: `
      <div class="w-80">
        <Field label="Work email"><Input v-bind="args" v-model="value" /></Field>
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<InputArgs>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => ({
    components: { Field, Input },
    setup: () => ({ sizes: ['sm', 'md', 'lg'] as const }),
    template: `
      <div class="flex w-80 flex-col gap-4">
        <Field v-for="size in sizes" :key="size" :label="size" :size="size">
          <Input :size="size" :placeholder="size" />
        </Field>
      </div>
    `,
  }),
}

export const States: Story = {
  render: () => ({
    components: { Field, Input },
    template: `
      <div class="flex w-80 flex-col gap-4">
        <Field label="Default"><Input placeholder="Default" /></Field>
        <Field label="Read-only"><Input model-value="Read-only value" readonly /></Field>
        <Field label="Disabled" disabled><Input model-value="Cannot edit" /></Field>
        <Field label="Invalid" error="Enter a valid email address.">
          <Input model-value="not-an-email" />
        </Field>
      </div>
    `,
  }),
}

/** Icons sit inside the border, and the input pads itself to make room. */
export const WithIcons: Story = {
  render: () => ({
    components: { Field, Input },
    template: `
      <div class="flex w-80 flex-col gap-4">
        <Field label="Search users" label-sr-only>
          <Input type="search" placeholder="Search users">
          <template #leading>
            <svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="5" stroke="currentColor" stroke-width="1.5" />
              <path d="m13 13 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            </template>
          </Input>
        </Field>
        <Field label="Page size">
          <Input model-value="12" type="number">
            <template #trailing><span class="text-xs">rows</span></template>
          </Input>
        </Field>
      </div>
    `,
  }),
}

/** Inside a `Field` the input inherits its id, description and state. */
export const InAField: Story = {
  render: () => ({
    components: { Field, Input },
    template: `
      <div class="w-80">
        <Field label="Work email" hint="We only use this for billing receipts." required>
          <Input type="email" placeholder="ada@example.com" />
        </Field>
      </div>
    `,
  }),
}

export const TypingUpdatesTheModel: Story = {
  render: () => ({
    components: { Field, Input },
    setup: () => {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="w-80">
        <Field label="Company name" label-sr-only>
          <Input v-model="value" placeholder="Type here" />
        </Field>
        <p class="mt-2 text-sm text-text-muted">Model: <span data-testid="echo">{{ value }}</span></p>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByPlaceholderText('Type here'), 'acme')
    await expect(canvas.getByTestId('echo')).toHaveTextContent('acme')
  },
}
