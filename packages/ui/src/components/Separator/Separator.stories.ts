import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Separator from './Separator.vue'

const meta: Meta<typeof Separator> = {
  title: 'Foundations/Separator',
  component: Separator,
  tags: ['autodocs'],
  args: { orientation: 'horizontal', decorative: false },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  render: (args) => ({
    components: { Separator },
    setup: () => ({ args }),
    template: `
      <div v-if="args.orientation === 'vertical'" class="flex h-10 items-center gap-1 text-ui">
        <span>Left</span><Separator v-bind="args" /><span>Right</span>
      </div>
      <div v-else class="flex w-60 flex-col gap-1 text-ui">
        <span>Above</span><Separator v-bind="args" /><span>Below</span>
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<typeof Separator>

/** The etched line between menu groups and dialog sections. */
export const Horizontal: Story = {}

/** Between toolbar groups: stretches to the row's height. */
export const Vertical: Story = { args: { orientation: 'vertical' } }
