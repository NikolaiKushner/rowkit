import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Field from '../Field/Field.vue'
import Input from '../Input/Input.vue'
import GroupBox from './GroupBox.vue'

const meta: Meta<typeof GroupBox> = {
  title: 'Foundations/GroupBox',
  component: GroupBox,
  tags: ['autodocs'],
  args: { legend: 'Group', as: 'fieldset' },
  argTypes: { as: { control: 'inline-radio', options: ['fieldset', 'section', 'div'] } },
  render: (args) => ({
    components: { GroupBox },
    setup: () => ({ args }),
    template: `
      <GroupBox v-bind="args" class="w-[280px]">
        <p>Anything grouped under one heading.</p>
      </GroupBox>
    `,
  }),
}

export default meta
type Story = StoryObj<typeof GroupBox>

export const Default: Story = {}

/**
 * A form section in a property dialog: the fieldset groups the controls, and
 * the legend names them for assistive technology.
 */
export const FormSection: Story = {
  render: () => ({
    components: { GroupBox, Field, Input },
    template: `
      <GroupBox legend="Shipping address" class="w-[320px] [--rk-field-label-width:4rem]">
        <Field layout="left" label="Street"><Input model-value="12 Analytical Row" /></Field>
        <Field layout="left" label="City"><Input model-value="London" /></Field>
      </GroupBox>
    `,
  }),
}

/** Framing something that is not a form: a `section` named by its legend. */
export const AsSection: Story = {
  args: { as: 'section', legend: 'Example' },
}
