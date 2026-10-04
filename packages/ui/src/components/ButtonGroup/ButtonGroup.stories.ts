import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from '../Button/Button.vue'
import SearchIcon from '../../icons/SearchIcon.vue'
import Separator from '../Separator/Separator.vue'
import ButtonGroup from './ButtonGroup.vue'

const meta: Meta = {
  title: 'Foundations/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

/**
 * The Figma Home toolbar: ghost buttons edge to edge, groups 4px apart with
 * the etched Separator between them.
 */
export const Default: Story = {
  render: () => ({
    components: { Button, ButtonGroup, Separator },
    template: `
      <ButtonGroup aria-label="Actions">
        <ButtonGroup>
          <Button variant="ghost">Export</Button>
          <Button variant="ghost">Delete</Button>
        </ButtonGroup>
        <Separator orientation="vertical" />
        <ButtonGroup>
          <Button variant="ghost">Archive</Button>
          <Button variant="ghost">Report</Button>
        </ButtonGroup>
      </ButtonGroup>
    `,
  }),
}

/** Icon-only toolbar buttons. Each has an accessible name. */
export const IconToolbar: Story = {
  render: () => ({
    components: { Button, ButtonGroup, Separator, SearchIcon },
    template: `
      <ButtonGroup aria-label="Tools">
        <Button variant="ghost" size="icon-sm" aria-label="Find"><SearchIcon /></Button>
        <Button variant="ghost" size="icon-sm" aria-label="Find next"><SearchIcon /></Button>
        <Separator orientation="vertical" />
        <Button variant="ghost" size="icon-sm" aria-label="Replace"><SearchIcon /></Button>
      </ButtonGroup>
    `,
  }),
}

/** Raised command buttons work the same way: edge to edge, bevels intact. */
export const CommandButtons: Story = {
  render: () => ({
    components: { Button, ButtonGroup },
    template: `
      <ButtonGroup aria-label="Navigate">
        <Button variant="secondary">Back</Button>
        <Button variant="secondary">Next</Button>
      </ButtonGroup>
    `,
  }),
}

export const Vertical: Story = {
  render: () => ({
    components: { Button, ButtonGroup },
    template: `
      <ButtonGroup orientation="vertical" aria-label="Stack">
        <Button variant="secondary">Top</Button>
        <Button variant="secondary">Middle</Button>
        <Button variant="secondary">Bottom</Button>
      </ButtonGroup>
    `,
  }),
}
