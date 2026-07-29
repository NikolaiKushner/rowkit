import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Input from '../Input/Input.vue'
import Field from './Field.vue'

/** A field wrapping the control it is meant to describe. */
function mountField(props: Record<string, unknown>) {
  return mount(
    defineComponent({
      setup: () => () => h(Field, props, { default: () => h(Input) }),
    })
  )
}

describe('Field', () => {
  it('points the label at the control', () => {
    const wrapper = mountField({ label: 'Email' })
    const forAttr = wrapper.find('label').attributes('for')
    expect(forAttr).toBeTruthy()
    expect(wrapper.find('input').attributes('id')).toBe(forAttr)
  })

  it('generates a unique id per field within an app', () => {
    // Both fields go in one app: Vue's useId counter is app-scoped, so two
    // separate mounts would reuse ids for reasons that never occur on a page.
    const wrapper = mount(
      defineComponent({
        setup: () => () => [
          h(Field, { label: 'A' }, { default: () => h(Input) }),
          h(Field, { label: 'B' }, { default: () => h(Input) }),
        ],
      })
    )
    const ids = wrapper.findAll('input').map((input) => input.attributes('id'))
    expect(ids).toHaveLength(2)
    expect(ids[0]).not.toBe(ids[1])
  })

  it('honours an explicit id', () => {
    const wrapper = mountField({ label: 'Email', id: 'email' })
    expect(wrapper.find('input').attributes('id')).toBe('email')
    expect(wrapper.find('label').attributes('for')).toBe('email')
  })

  it('describes the control with its hint', () => {
    const wrapper = mountField({ label: 'Email', hint: 'Work address' })
    const describedBy = wrapper.find('input').attributes('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(wrapper.find(`#${describedBy}`).text()).toBe('Work address')
  })

  it('describes the control with hint and error together', () => {
    // The hint does not disappear because the value is currently wrong, and
    // the guidance is announced before the correction.
    const wrapper = mountField({ label: 'Email', hint: 'Work address', error: 'Required' })
    const ids = wrapper.find('input').attributes('aria-describedby')?.split(' ') ?? []
    expect(ids).toHaveLength(2)
    expect(wrapper.find(`#${ids[0]}`).text()).toBe('Work address')
    expect(wrapper.find(`#${ids[1]}`).text()).toBe('Required')
  })

  it('omits aria-describedby when there is nothing to describe', () => {
    expect(
      mountField({ label: 'Email' }).find('input').attributes('aria-describedby')
    ).toBeUndefined()
  })

  it('announces the error', () => {
    const wrapper = mountField({ label: 'Email', error: 'Required' })
    expect(wrapper.find('[role="alert"]').text()).toBe('Required')
  })

  it('marks the control invalid when an error is present', () => {
    expect(
      mountField({ label: 'Email', error: 'Required' }).find('input').attributes('aria-invalid')
    ).toBe('true')
    expect(mountField({ label: 'Email' }).find('input').attributes('aria-invalid')).toBeUndefined()
  })

  it('propagates required to the control and hides the asterisk', () => {
    const wrapper = mountField({ label: 'Email', required: true })
    expect(wrapper.find('input').attributes('required')).toBeDefined()
    // `required` is already on the control; announcing it twice is noise.
    expect(wrapper.find('label span').attributes('aria-hidden')).toBe('true')
  })

  it('propagates disabled to the control', () => {
    expect(
      mountField({ label: 'Email', disabled: true }).find('input').attributes('disabled')
    ).toBeDefined()
  })

  it('keeps the label available to screen readers when hidden', () => {
    const wrapper = mountField({ label: 'Search', labelSrOnly: true })
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.classes()).toContain('sr-only')
  })
})
