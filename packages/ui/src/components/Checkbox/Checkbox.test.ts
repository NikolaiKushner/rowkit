import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick, type Component } from 'vue'
import RawCheckbox from './Checkbox.vue'

const Checkbox = RawCheckbox as unknown as Component

describe('Checkbox', () => {
  it('is a native check box named by its label', () => {
    const el = mount(Checkbox, { props: { label: 'Email me' } })
    const input = el.find('input')
    expect(input.attributes('type')).toBe('checkbox')
    // The row is a <label> pointing at the input: the label names it, and
    // clicking anywhere on the row toggles it.
    expect(el.element.tagName).toBe('LABEL')
    expect(el.attributes('for')).toBe(input.attributes('id'))
    expect(el.text()).toBe('Email me')
  })

  it('updates v-model when toggled', async () => {
    const el = mount(Checkbox, { props: { label: 'x', modelValue: false } })
    await el.find('input').setValue(true)
    expect(el.emitted('update:modelValue')?.at(-1)).toEqual([true])
  })

  it('draws the check while checked', async () => {
    const el = mount(Checkbox, { props: { label: 'x', modelValue: false } })
    expect(el.findComponent({ name: 'RkCheckGlyphIcon' }).exists()).toBe(false)
    await el.setProps({ modelValue: true })
    expect(el.findComponent({ name: 'RkCheckGlyphIcon' }).exists()).toBe(true)
    expect(el.attributes('data-state')).toBe('checked')
  })

  it('is mixed while indeterminate: the bar, and the native property', async () => {
    const el = mount(Checkbox, { props: { label: 'All', indeterminate: true } })
    await nextTick()
    const input = el.find<HTMLInputElement>('input').element
    expect(input.indeterminate).toBe(true)
    expect(el.attributes('data-state')).toBe('indeterminate')
    expect(el.find('[data-slot="checkbox-box"] span').classes()).toContain('h-[2px]')
  })

  it('disables the input and marks the row', () => {
    const el = mount(Checkbox, { props: { label: 'x', disabled: true } })
    expect(el.find('input').attributes('disabled')).toBeDefined()
    expect(el.attributes('data-disabled')).toBe('')
  })

  it('puts consumer attributes on the input and the class on the row', () => {
    const el = mount(Checkbox, {
      props: { class: 'my-1' },
      attrs: { 'aria-label': 'Select row 3' },
    })
    expect(el.find('input').attributes('aria-label')).toBe('Select row 3')
    expect(el.classes()).toContain('my-1')
  })

  it('draws the focus ring round the box when there is no label', () => {
    const el = mount(Checkbox, { attrs: { 'aria-label': 'x' } })
    expect(el.find('[data-slot="checkbox-label"]').exists()).toBe(false)
    expect(el.find('[data-slot="checkbox-box"]').classes().join(' ')).toContain(
      'group-has-[input:focus-visible]/checkbox:outline-dotted'
    )
  })

  it('submits its name and value with a form', () => {
    const el = mount(Checkbox, { props: { name: 'news', value: 'weekly' } })
    expect(el.find('input').attributes('name')).toBe('news')
    expect(el.find<HTMLInputElement>('input').element.value).toBe('weekly')
  })
})
