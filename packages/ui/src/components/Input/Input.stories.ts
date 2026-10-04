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

/**
 * What each type brings into the frame: the magnifier, the spin buttons, the
 * drop button. Password, email and the rest are plain edit boxes.
 */
export const Types: Story = {
  render: () => ({
    components: { Field, Input },
    setup: () => ({ query: ref('lovelace'), count: ref(25), day: ref('2026-10-03') }),
    template: `
      <div class="flex w-80 flex-col gap-4">
        <Field label="Search users"><Input v-model="query" type="search" placeholder="Search users" /></Field>
        <Field label="Max upload size (MB)"><Input v-model="count" type="number" min="1" max="100" /></Field>
        <Field label="Start date"><Input v-model="day" type="date" /></Field>
        <Field label="Password"><Input type="password" model-value="hunter22" /></Field>
      </div>
    `,
  }),
}

/** A slot for anything else that belongs inside the frame, like a unit. */
export const WithSlots: Story = {
  render: () => ({
    components: { Field, Input },
    template: `
      <div class="w-80">
        <Field label="Page size">
          <Input model-value="12" inputmode="numeric">
            <template #trailing><span class="text-text-subtle">rows</span></template>
          </Input>
        </Field>
      </div>
    `,
  }),
}

/** A spin button steps the value and leaves focus in the field; held, it repeats. */
export const SpinButtonsStep: Story = {
  render: () => ({
    components: { Field, Input },
    setup: () => ({ count: ref(5) }),
    template: `
      <div class="w-40">
        <Field label="Copies"><Input v-model="count" type="number" /></Field>
        <span data-testid="echo">{{ count }}</span>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Copies')
    const up = canvasElement.querySelector('[data-slot="input-spin"] > span')
    if (!(up instanceof HTMLElement)) throw new Error('No spin button')
    await userEvent.pointer({ keys: '[MouseLeft]', target: up })
    await expect(canvas.getByTestId('echo')).toHaveTextContent('6')
    // Focus stays in the field, where the arrow keys step natively.
    await expect(input).toHaveFocus()
  },
}

/** Escape empties a search field, and only then: an empty field lets it through. */
export const EscapeClearsSearch: Story = {
  render: () => ({
    components: { Field, Input },
    setup: () => ({ query: ref('ada') }),
    template: `
      <div class="w-80">
        <Field label="Search users"><Input v-model="query" type="search" /></Field>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Search users')
    await userEvent.click(input)
    await userEvent.keyboard('{Escape}')
    await expect(input).toHaveValue('')
  },
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
        <p class="mt-2 text-sm text-muted-foreground">Model: <span data-testid="echo">{{ value }}</span></p>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByPlaceholderText('Type here'), 'acme')
    await expect(canvas.getByTestId('echo')).toHaveTextContent('acme')
  },
}
