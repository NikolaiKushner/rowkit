import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import ComputerIcon from '../../icons/ComputerIcon.vue'
import Info32Icon from '../../icons/Info32Icon.vue'
import Button from '../Button/Button.vue'
import StatusBar from '../StatusBar/StatusBar.vue'
import StatusBarSection from '../StatusBar/StatusBarSection.vue'
import Window from './Window.vue'
import WindowBody from './WindowBody.vue'
import WindowButton from './WindowButton.vue'
import WindowTitleBar from './WindowTitleBar.vue'

const parts = { Window, WindowTitleBar, WindowButton, WindowBody, Button, ComputerIcon }

const meta: Meta = {
  title: 'Foundations/Window',
  component: Window,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

/** The Figma "About rowkit" window: icon, title, close; a padded body. */
export const Default: Story = {
  render: () => ({
    components: { ...parts, Info32Icon },
    template: `
      <Window class="w-[400px]">
        <WindowTitleBar title="About rowkit">
          <template #icon><ComputerIcon /></template>
          <template #controls><WindowButton glyph="close" label="Close" /></template>
        </WindowTitleBar>
        <WindowBody class="flex gap-4 p-4">
          <Info32Icon />
          <div class="flex flex-col gap-2">
            <p>A professional Vue 3 toolkit — the components a product interface is built from.</p>
            <div class="flex gap-1.5">
              <Button>Get started</Button>
              <Button variant="secondary">Components</Button>
            </div>
          </div>
        </WindowBody>
      </Window>
    `,
  }),
}

/** All three caption buttons, and the window behind them inactive. */
export const ActiveAndInactive: Story = {
  render: () => ({
    components: parts,
    template: `
      <div class="flex flex-col gap-4">
        <Window v-for="active in [true, false]" :key="String(active)" :active="active" class="w-[320px]">
          <WindowTitleBar :title="active ? 'Active window' : 'Inactive window'">
            <template #icon><ComputerIcon /></template>
            <template #controls>
              <WindowButton glyph="minimize" label="Minimize" />
              <WindowButton glyph="maximize" label="Maximize" />
              <WindowButton glyph="close" label="Close" />
            </template>
          </WindowTitleBar>
          <WindowBody class="h-16" />
        </Window>
      </div>
    `,
  }),
}

/** Maximized shows restore in place of maximize; a disabled close is embossed. */
export const RestoreAndDisabled: Story = {
  render: () => ({
    components: parts,
    template: `
      <Window class="w-[320px]">
        <WindowTitleBar title="Copying files">
          <template #controls>
            <WindowButton glyph="minimize" label="Minimize" />
            <WindowButton glyph="restore" label="Restore" />
            <WindowButton glyph="close" label="Close" disabled />
          </template>
        </WindowTitleBar>
        <WindowBody class="h-12" />
      </Window>
    `,
  }),
}

/** The Figma Home template's frame: title bar, a body, a status bar. */
export const WithStatusBar: Story = {
  render: () => ({
    components: { ...parts, StatusBar, StatusBarSection },
    template: `
      <Window class="w-[480px]">
        <WindowTitleBar title="Users — rowkit playground">
          <template #controls>
            <WindowButton glyph="minimize" label="Minimize" />
            <WindowButton glyph="maximize" label="Maximize" />
            <WindowButton glyph="close" label="Close" />
          </template>
        </WindowTitleBar>
        <WindowBody class="h-24 bg-input shadow-sunken" />
        <StatusBar>
          <StatusBarSection>312 users</StatusBarSection>
          <StatusBarSection class="w-[100px]">2 selected</StatusBarSection>
        </StatusBar>
      </Window>
    `,
  }),
}

/** Caption buttons are real buttons: Tab reaches them, Enter fires them. */
export const Keyboard: Story = {
  render: () => ({
    components: parts,
    setup: () => ({ open: ref(true) }),
    template: `
      <Window v-if="open" class="w-[320px]">
        <WindowTitleBar title="Notepad">
          <template #controls><WindowButton glyph="close" label="Close" @click="open = false" /></template>
        </WindowTitleBar>
        <WindowBody class="h-12" />
      </Window>
      <p v-else>Closed</p>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: 'Notepad' })).toBeInTheDocument()
    await userEvent.tab()
    await expect(canvas.getByRole('button', { name: 'Close' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(await canvas.findByText('Closed')).toBeInTheDocument()
  },
}
