import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Pagination from '../Pagination/Pagination.vue'
import StatusBar from './StatusBar.vue'
import StatusBarSection from './StatusBarSection.vue'

const meta: Meta<typeof StatusBar> = {
  title: 'Foundations/StatusBar',
  component: StatusBar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StatusBar>

/** The Figma status bar: the first section fills, the others take a width. */
export const Default: Story = {
  render: () => ({
    components: { StatusBar, StatusBarSection },
    template: `
      <div class="w-[480px]">
        <StatusBar>
          <StatusBarSection>Users 1–25 of 312</StatusBarSection>
          <StatusBarSection class="w-[100px]">3 selected</StatusBarSection>
          <StatusBarSection class="w-[100px]">Page 1 of 13</StatusBarSection>
        </StatusBar>
      </div>
    `,
  }),
}

/** A single section: the bar is one sunken cell, full width. */
export const OneSection: Story = {
  render: () => ({
    components: { StatusBar, StatusBarSection },
    template: `
      <div class="w-[480px]">
        <StatusBar><StatusBarSection>Ready</StatusBarSection></StatusBar>
      </div>
    `,
  }),
}

/** Long text is cut off with an ellipsis; the bar never grows taller. */
export const LongText: Story = {
  render: () => ({
    components: { StatusBar, StatusBarSection },
    template: `
      <div class="w-[320px]">
        <StatusBar>
          <StatusBarSection>Synchronising 1,204 records with the billing service…</StatusBarSection>
          <StatusBarSection class="w-[80px]">Offline</StatusBarSection>
        </StatusBar>
      </div>
    `,
  }),
}

/**
 * The Figma Home template's window footer: the summary in a section, the page
 * buttons beside it on the bar's own face.
 */
export const WithPagination: Story = {
  render: () => ({
    components: { StatusBar, StatusBarSection, Pagination },
    template: `
      <div class="w-[640px]">
        <StatusBar class="h-auto items-center">
          <StatusBarSection class="h-[22px]">1–25 of 312 · 2 selected</StatusBarSection>
          <Pagination :total="312" :page-size="25" size="sm" hide-summary hide-page-size label="Users pages" />
        </StatusBar>
      </div>
    `,
  }),
}
