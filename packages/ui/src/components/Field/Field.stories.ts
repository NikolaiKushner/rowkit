import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, within } from 'storybook/test'
import Input from '../Input/Input.vue'
import Select from '../Select/Select.vue'
import Field from './Field.vue'
import type { Component } from 'vue'

/**
 * Storybook's story types expect a concrete component. `Select` is generic over its value type, which cannot be expressed in that position — the generic
 * surface is covered by the typed unit tests instead.
 */
const SelectComponent = Select as unknown as Component

interface FieldArgs {
  label: string
  hint?: string
  error?: string
  required: boolean
  disabled: boolean
  size: 'sm' | 'md' | 'lg'
  labelSrOnly: boolean
}

const meta: Meta<FieldArgs> = {
  title: 'Foundations/Field',
  component: Field,
  tags: ['autodocs'],
  args: {
    label: 'Work email',
    required: false,
    disabled: false,
    size: 'md',
    labelSrOnly: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => ({
    components: { Field, Input },
    setup: () => ({ args }),
    template: `
      <div class="w-80">
        <Field v-bind="args"><Input placeholder="ada@example.com" /></Field>
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<FieldArgs>

export const Default: Story = {}

export const WithHint: Story = {
  args: { hint: 'We only use this for billing receipts.' },
}

/**
 * The hint does not disappear when the value is wrong — a screen reader gets
 * the guidance and then the correction.
 */
export const WithError: Story = {
  args: {
    hint: 'We only use this for billing receipts.',
    error: 'Enter a valid email address.',
  },
}

export const Required: Story = {
  args: { required: true, hint: 'Required to invite the user.' },
}

export const Disabled: Story = {
  args: { disabled: true, hint: 'Managed by your identity provider.' },
}

export const Sizes: Story = {
  render: () => ({
    components: { Field, Input },
    setup: () => ({ sizes: ['sm', 'md', 'lg'] as const }),
    template: `
      <div class="flex w-80 flex-col gap-5">
        <Field v-for="size in sizes" :key="size" :size="size" :label="size" hint="Help text">
          <Input :size="size" placeholder="ada@example.com" />
        </Field>
      </div>
    `,
  }),
}

/** The label is still there for screen readers; only the pixels are gone. */
export const LabelHiddenVisually: Story = {
  args: { label: 'Search users', labelSrOnly: true },
  render: (args) => ({
    components: { Field, Input },
    setup: () => ({ args }),
    template: `
      <div class="w-80">
        <Field v-bind="args"><Input type="search" placeholder="Search users" /></Field>
      </div>
    `,
  }),
}

/** The same wiring drives a Select — id, description and state all flow through. */
export const WrappingASelect: Story = {
  args: { label: 'Status', error: 'Pick a status before saving.' },
  render: (args) => ({
    components: { Field, Select: SelectComponent },
    setup: () => ({
      args,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Invited', value: 'invited' },
      ],
    }),
    template: `
      <div class="w-80">
        <Field v-bind="args"><Select :options="options" /></Field>
      </div>
    `,
  }),
}

/**
 * The wiring is the whole point of this component, so it is asserted rather
 * than eyeballed: label points at the control, and the control is described by
 * the hint and the error in that order.
 */
export const WiresLabelAndDescriptions: Story = {
  args: {
    hint: 'We only use this for billing receipts.',
    error: 'Enter a valid email address.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Work email')

    const describedBy = input.getAttribute('aria-describedby')?.split(' ') ?? []
    await expect(describedBy).toHaveLength(2)
    await expect(document.getElementById(describedBy[0] ?? '')).toHaveTextContent(
      'We only use this for billing receipts.'
    )
    await expect(document.getElementById(describedBy[1] ?? '')).toHaveTextContent(
      'Enter a valid email address.'
    )
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(canvas.getByRole('alert')).toHaveTextContent('Enter a valid email address.')
  },
}
