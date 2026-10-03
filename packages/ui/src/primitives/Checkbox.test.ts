import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Checkbox from './Checkbox.vue'

function mountCheckbox(modelValue: boolean | 'indeterminate', disabled = false) {
  return mount(Checkbox, {
    props: { modelValue, disabled },
    attrs: { 'aria-label': 'Select row' },
    slots: { default: () => h('svg', { class: 'mark' }) },
  })
}

describe('Checkbox', () => {
  it.each([
    [false, 'false', 'unchecked'],
    [true, 'true', 'checked'],
    ['indeterminate', 'mixed', 'indeterminate'],
  ] as const)('%s renders aria-checked=%s and data-state=%s', (value, aria, state) => {
    const wrapper = mountCheckbox(value)
    expect(wrapper.attributes('role')).toBe('checkbox')
    expect(wrapper.attributes('aria-checked')).toBe(aria)
    expect(wrapper.attributes('data-state')).toBe(state)
  })

  it('is a button that never submits a form', () => {
    expect(mountCheckbox(false).attributes('type')).toBe('button')
  })

  it('shows the mark only while checked or indeterminate', () => {
    expect(mountCheckbox(false).find('.mark').exists()).toBe(false)
    expect(mountCheckbox(true).find('.mark').exists()).toBe(true)
    expect(mountCheckbox('indeterminate').find('.mark').exists()).toBe(true)
  })

  it.each([
    [false, true],
    [true, false],
    ['indeterminate', true],
  ] as const)('activating %s emits %s', async (value, next) => {
    const wrapper = mountCheckbox(value)
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[next]])
  })

  it('does not activate on Enter, per WAI-ARIA', () => {
    const wrapper = mountCheckbox(false)
    const enter = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true })
    ;(wrapper.element as HTMLButtonElement).dispatchEvent(enter)
    expect(enter.defaultPrevented).toBe(true)
  })

  it('is disabled with data-disabled when disabled', () => {
    const wrapper = mountCheckbox(false, true)
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.attributes('data-disabled')).toBe('')
  })

  it('passes the consumer’s accessible name through', () => {
    expect(mountCheckbox(false).attributes('aria-label')).toBe('Select row')
  })
})
