import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import StatusBar from './StatusBar.vue'
import StatusBarSection from './StatusBarSection.vue'

const Bar = {
  components: { StatusBar, StatusBarSection },
  template: `
    <StatusBar>
      <StatusBarSection>Users 1–25 of 312</StatusBarSection>
      <StatusBarSection class="w-[100px]">3 selected</StatusBarSection>
    </StatusBar>
  `,
}

describe('StatusBar', () => {
  it('renders its sections in order', () => {
    const el = mount(Bar)
    const sections = el.findAll('[data-slot="status-bar-section"]')
    expect(sections.map((s) => s.text())).toEqual(['Users 1–25 of 312', '3 selected'])
  })

  it('lets the first section fill the width the others leave', () => {
    const classes = mount(Bar).find('[data-slot="status-bar"]').classes()
    expect(classes).toContain('[&>[data-slot=status-bar-section]:first-child]:flex-1')
  })

  it('draws each section in the thin status bevel', () => {
    const section = mount(Bar).find('[data-slot="status-bar-section"]')
    expect(section.classes()).toContain('shadow-status')
  })

  it('merges a consumer class onto a section', () => {
    const second = mount(Bar).findAll('[data-slot="status-bar-section"]')[1]
    expect(second?.classes()).toContain('w-[100px]')
  })
})
