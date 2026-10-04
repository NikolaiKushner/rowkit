import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, type ConcreteComponent } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import GroupBox from '../GroupBox/GroupBox.vue'
import RawRadio from './Radio.vue'

/** Generic components are cast for Storybook's types, as Select's stories do. */
const Radio = RawRadio as unknown as ConcreteComponent

interface RadioArgs {
  label: string
  disabled: boolean
}

const meta: Meta<RadioArgs> = {
  title: 'Forms/Radio',
  component: Radio,
  tags: ['autodocs'],
  args: { label: 'Label', disabled: false },
  render: (args) => ({
    components: { Radio },
    setup: () => ({ args, value: ref('a') }),
    template: `<Radio v-model="value" value="a" v-bind="args" />`,
  }),
}

export default meta
type Story = StoryObj<RadioArgs>

export const Default: Story = {}

/** The Figma grid: unchecked and checked, enabled and disabled. */
export const States: Story = {
  render: () => ({
    components: { Radio },
    template: `
      <div class="grid grid-cols-2 gap-3">
        <Radio value="a" label="Label" />
        <Radio value="a" label="Label" disabled />
        <Radio value="a" model-value="a" label="Label" />
        <Radio value="a" model-value="a" label="Label" disabled />
      </div>
    `,
  }),
}

/** One choice from a few, under a legend that names the group. */
export const Group: Story = {
  render: () => ({
    components: { Radio, GroupBox },
    setup: () => ({ plan: ref('free') }),
    template: `
      <GroupBox legend="Plan" class="w-[200px]">
        <Radio v-model="plan" name="plan" value="free" label="Free" />
        <Radio v-model="plan" name="plan" value="pro" label="Pro" />
        <Radio v-model="plan" name="plan" value="team" label="Team" />
      </GroupBox>
    `,
  }),
}

/** Tab enters the group at the chosen option; the arrow keys move the choice. */
export const Keyboard: Story = {
  render: () => ({
    components: { Radio },
    setup: () => ({ plan: ref('free') }),
    template: `
      <div role="radiogroup" aria-label="Plan" class="flex flex-col gap-2">
        <Radio v-model="plan" name="kbd-plan" value="free" label="Free" />
        <Radio v-model="plan" name="kbd-plan" value="pro" label="Pro" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await expect(canvas.getByRole('radio', { name: 'Free' })).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    const pro = canvas.getByRole('radio', { name: 'Pro' })
    await expect(pro).toHaveFocus()
    await expect(pro).toBeChecked()
  },
}
