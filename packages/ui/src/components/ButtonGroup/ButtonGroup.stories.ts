import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from '../Button/Button.vue'
import ButtonGroup from './ButtonGroup.vue'

const meta: Meta = {
  title: 'Foundations/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

const ChevronIcon = {
  template: `
    <svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="m12 5-5 5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
}

const MoreIcon = {
  template: `
    <svg class="size-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <circle cx="4" cy="10" r="1.5" />
      <circle cx="10" cy="10" r="1.5" />
      <circle cx="16" cy="10" r="1.5" />
    </svg>
  `,
}

/** Matches the reference layout: icon, Archive/Report, Snooze/more. */
export const Default: Story = {
  render: () => ({
    components: { Button, ButtonGroup, ChevronIcon, MoreIcon },
    template: `
      <ButtonGroup aria-label="Actions">
        <ButtonGroup>
          <Button variant="outline" size="icon" aria-label="Open">
            <ChevronIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">Archive</Button>
          <Button variant="secondary">Report</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">Snooze</Button>
          <Button variant="outline" size="icon" aria-label="More">
            <MoreIcon />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    `,
  }),
}

export const Vertical: Story = {
  render: () => ({
    components: { Button, ButtonGroup },
    template: `
      <ButtonGroup orientation="vertical" aria-label="Stack">
        <Button variant="outline">Top</Button>
        <Button variant="outline">Middle</Button>
        <Button variant="outline">Bottom</Button>
      </ButtonGroup>
    `,
  }),
}
