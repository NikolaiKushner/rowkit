import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import Window from './Window.vue'
import WindowBody from './WindowBody.vue'
import WindowButton from './WindowButton.vue'
import WindowTitleBar from './WindowTitleBar.vue'

const Harness = defineComponent({
  components: { Window, WindowTitleBar, WindowButton, WindowBody },
  props: {
    active: { type: Boolean, default: true },
    closeDisabled: { type: Boolean, default: false },
  },
  emits: ['close'],
  template: `
    <Window :active="active">
      <WindowTitleBar title="Users">
        <template #controls>
          <WindowButton glyph="minimize" label="Minimize" />
          <WindowButton glyph="maximize" label="Maximize" />
          <WindowButton glyph="close" label="Close" :disabled="closeDisabled" @click="$emit('close')" />
        </template>
      </WindowTitleBar>
      <WindowBody>Body</WindowBody>
    </Window>
  `,
})

describe('Window', () => {
  it('is a section named by its title', () => {
    const el = mount(Harness)
    const root = el.find('[data-slot="window"]')
    expect(root.element.tagName).toBe('SECTION')
    const title = el.find('[data-slot="window-title"]')
    expect(title.text()).toBe('Users')
    expect(root.attributes('aria-labelledby')).toBe(title.attributes('id'))
  })

  it('marks an inactive window, which greys its title bar', async () => {
    const el = mount(Harness)
    expect(el.find('[data-slot="window"]').attributes('data-inactive')).toBeUndefined()
    await el.setProps({ active: false })
    expect(el.find('[data-slot="window"]').attributes('data-inactive')).toBe('')
    expect(el.find('[data-slot="window-title-bar"]').classes()).toContain(
      'group-data-inactive/window:from-titlebar-inactive-from'
    )
  })

  it('names each caption button and draws its glyph', () => {
    const buttons = mount(Harness).findAll('[data-slot="window-button"]')
    expect(buttons.map((b) => b.attributes('aria-label'))).toEqual([
      'Minimize',
      'Maximize',
      'Close',
    ])
    expect(buttons.map((b) => b.attributes('data-glyph'))).toEqual([
      'minimize',
      'maximize',
      'close',
    ])
  })

  it('reports a click and leaves what it means to the caller', async () => {
    const el = mount(Harness)
    await el.findAll('[data-slot="window-button"]')[2]?.trigger('click')
    expect(el.emitted('close')).toHaveLength(1)
  })

  it('disables a caption button', () => {
    const close = mount(Harness, { props: { closeDisabled: true } }).findAll('button')[2]
    expect(close?.attributes('disabled')).toBeDefined()
  })

  it('throws when a part is used outside Window', () => {
    expect(() => mount(WindowTitleBar, { props: { title: 'x' } })).toThrow(/inside Window/)
  })
})
