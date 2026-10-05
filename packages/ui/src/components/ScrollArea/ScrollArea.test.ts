import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ScrollArea from './ScrollArea.vue'

/*
 * jsdom has no layout, so nothing here overflows: these cover the markup and
 * the props. Scrolling, the thumb and the arrows are measured in a real
 * browser, in the stories.
 */
describe('ScrollArea', () => {
  it('renders the content inside the viewport', () => {
    const el = mount(ScrollArea, { slots: { default: '<p>Line</p>' } })
    expect(el.find('[data-slot="scroll-area-viewport"] p').text()).toBe('Line')
  })

  it('draws no bar while nothing overflows', () => {
    const el = mount(ScrollArea, { slots: { default: 'Short' } })
    expect(el.find('[data-slot="scroll-area-scrollbar"]').exists()).toBe(false)
  })

  it('draws both bars, disabled, when asked to always show them', () => {
    const el = mount(ScrollArea, { props: { scrollbars: 'always' } })
    const bars = el.findAll('[data-slot="scroll-area-scrollbar"]')
    expect(bars.map((bar) => bar.attributes('data-orientation'))).toEqual([
      'vertical',
      'horizontal',
    ])
    // Nothing to scroll: grey arrows, no thumb.
    for (const bar of bars) {
      expect(bar.attributes('aria-hidden')).toBe('true')
      expect(bar.find('[data-slot="scroll-area-thumb"]').exists()).toBe(false)
      expect(bar.findAll('[data-disabled]')).toHaveLength(2)
    }
  })

  it('names the region when given a label', () => {
    const el = mount(ScrollArea, { props: { label: 'Event log' } })
    const viewport = el.find('[data-slot="scroll-area-viewport"]')
    expect(viewport.attributes('role')).toBe('region')
    expect(viewport.attributes('aria-label')).toBe('Event log')
  })

  it('is no region and no tab stop without a label and overflow', () => {
    const viewport = mount(ScrollArea).find('[data-slot="scroll-area-viewport"]')
    expect(viewport.attributes('role')).toBeUndefined()
    expect(viewport.attributes('tabindex')).toBeUndefined()
  })

  it('merges a consumer class on the root', () => {
    const el = mount(ScrollArea, { props: { class: 'h-40' } })
    expect(el.attributes('data-slot')).toBe('scroll-area')
    expect(el.classes()).toContain('h-40')
  })
})
