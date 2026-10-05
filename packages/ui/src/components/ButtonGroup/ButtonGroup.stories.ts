import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from '../Button/Button.vue'
import CopyIcon from '../../icons/CopyIcon.vue'
import FilterIcon from '../../icons/FilterIcon.vue'
import PlusIcon from '../../icons/PlusIcon.vue'
import TrashIcon from '../../icons/TrashIcon.vue'
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
    components: { Button, ButtonGroup, Separator, CopyIcon, TrashIcon },
    template: `
      <ButtonGroup aria-label="Actions">
        <ButtonGroup>
          <Button variant="ghost"><template #leading><CopyIcon /></template>Export</Button>
          <Button variant="ghost"><template #leading><TrashIcon /></template>Delete</Button>
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

/**
 * The Figma "Toolbar with labels" example: icon and label while there is room,
 * an icon-only button — with an accessible name — after the separator.
 */
export const IconToolbar: Story = {
  render: () => ({
    components: { Button, ButtonGroup, Separator, PlusIcon, CopyIcon, TrashIcon, FilterIcon },
    template: `
      <ButtonGroup aria-label="Tools">
        <Button variant="ghost"><template #leading><PlusIcon /></template>New</Button>
        <Button variant="ghost"><template #leading><CopyIcon /></template>Copy</Button>
        <Button variant="ghost"><template #leading><TrashIcon /></template>Delete</Button>
        <Separator orientation="vertical" />
        <Button variant="ghost" size="icon-sm" aria-label="Filter"><FilterIcon /></Button>
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
