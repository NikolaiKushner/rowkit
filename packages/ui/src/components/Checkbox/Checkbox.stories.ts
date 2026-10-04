import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import GroupBox from '../GroupBox/GroupBox.vue'
import Checkbox from './Checkbox.vue'

interface CheckboxArgs {
  label: string
  indeterminate: boolean
  disabled: boolean
}

const meta: Meta<CheckboxArgs> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Label', indeterminate: false, disabled: false },
  render: (args) => ({
    components: { Checkbox },
    setup: () => ({ args, checked: ref(false) }),
    template: `<Checkbox v-model="checked" v-bind="args" />`,
  }),
}

export default meta
type Story = StoryObj<CheckboxArgs>

export const Default: Story = {}

/** The Figma grid: unchecked, checked and indeterminate, enabled and disabled. */
export const States: Story = {
  render: () => ({
    components: { Checkbox },
    template: `
      <div class="grid grid-cols-2 gap-3">
        <Checkbox label="Label" />
        <Checkbox label="Label" disabled />
        <Checkbox label="Label" :model-value="true" />
        <Checkbox label="Label" :model-value="true" disabled />
        <Checkbox label="Label" indeterminate />
        <Checkbox label="Label" indeterminate disabled />
      </div>
    `,
  }),
}

/** A group of options under a legend: the usual home of check boxes. */
export const InAGroupBox: Story = {
  render: () => ({
    components: { Checkbox, GroupBox },
    setup: () => ({ email: ref(true), sms: ref(false), push: ref(true) }),
    template: `
      <GroupBox legend="Notify me by" class="w-[220px]">
        <Checkbox v-model="email" label="Email" />
        <Checkbox v-model="sms" label="Text message" />
        <Checkbox v-model="push" label="Push notification" />
      </GroupBox>
    `,
  }),
}

/** Tab reaches it, Space toggles it, and the dotted ring shows round the label. */
export const Keyboard: Story = {
  render: () => ({
    components: { Checkbox },
    setup: () => ({ checked: ref(false) }),
    template: `<Checkbox v-model="checked" label="Remember me" />`,
  }),
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole('checkbox', { name: 'Remember me' })
    await userEvent.tab()
    await expect(box).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(box).toBeChecked()
    const label = canvasElement.querySelector('[data-slot="checkbox-label"]')
    if (!label) throw new Error('no label')
    await expect(getComputedStyle(label).outlineStyle).toBe('dotted')
  },
}
