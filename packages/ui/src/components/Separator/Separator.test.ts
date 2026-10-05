import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Separator from './Separator.vue'

describe('Separator', () => {
  it('is a horizontal separator by default', () => {
    const el = mount(Separator)
    expect(el.attributes('role')).toBe('separator')
    // Horizontal is the ARIA default, so it is not spelled out.
    expect(el.attributes('aria-orientation')).toBeUndefined()
    expect(el.attributes('data-orientation')).toBe('horizontal')
  })

  it('announces a vertical orientation', () => {
    const el = mount(Separator, { props: { orientation: 'vertical' } })
    expect(el.attributes('aria-orientation')).toBe('vertical')
    expect(el.classes()).toContain('self-stretch')
  })

  it('is hidden from assistive technology when decorative', () => {
    const el = mount(Separator, { props: { orientation: 'vertical', decorative: true } })
    expect(el.attributes('role')).toBe('none')
    expect(el.attributes('aria-orientation')).toBeUndefined()
  })

  it('merges a consumer class', () => {
    const el = mount(Separator, { props: { class: 'my-1' } })
    expect(el.classes()).toContain('my-1')
  })
})
