import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import GroupBox from './GroupBox.vue'

describe('GroupBox', () => {
  it('is a fieldset named by its legend by default', () => {
    const el = mount(GroupBox, { props: { legend: 'Shipping' }, slots: { default: '<input />' } })
    expect(el.element.tagName).toBe('FIELDSET')
    expect(el.find('legend').text()).toBe('Shipping')
    // A fieldset is named by its legend natively; no ARIA on top.
    expect(el.attributes('role')).toBeUndefined()
    expect(el.attributes('aria-labelledby')).toBeUndefined()
  })

  it('is a labelled group when rendered as another element', () => {
    const el = mount(GroupBox, { props: { legend: 'Example', as: 'section' } })
    expect(el.element.tagName).toBe('SECTION')
    expect(el.attributes('role')).toBe('group')
    const legend = el.find('[data-slot="group-box-legend"]')
    expect(legend.element.tagName).toBe('SPAN')
    expect(el.attributes('aria-labelledby')).toBe(legend.attributes('id'))
  })

  it('draws the etched frame 6px down, hidden from assistive technology', () => {
    const frame = mount(GroupBox, { props: { legend: 'x' } }).find('[aria-hidden="true"]')
    expect(frame.classes()).toEqual(expect.arrayContaining(['shadow-etched', 'top-1.5']))
  })

  it('lets the legend slot replace the prop', () => {
    const el = mount(GroupBox, {
      props: { legend: 'plain' },
      slots: { legend: '<strong>rich</strong>' },
    })
    expect(el.find('legend strong').text()).toBe('rich')
  })

  it('renders no legend when none is given', () => {
    expect(mount(GroupBox).find('legend').exists()).toBe(false)
  })

  it('merges a consumer class', () => {
    expect(mount(GroupBox, { props: { class: 'w-72' } }).classes()).toContain('w-72')
  })
})
