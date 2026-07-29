import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Field from '../Field/Field.vue'
import Input from './Input.vue'

describe('Input', () => {
  it('renders a text input by default', () => {
    const input = mount(Input).find('input')
    expect(input.attributes('type')).toBe('text')
  })

  it('updates the model as the user types', async () => {
    const wrapper = mount(Input, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('acme')
    expect(wrapper.emitted('update:modelValue')).toEqual([['acme']])
  })

  it('reflects the model', () => {
    expect(mount(Input, { props: { modelValue: 'acme' } }).find('input').element.value).toBe('acme')
  })

  it('marks itself invalid', () => {
    const wrapper = mount(Input, { props: { invalid: true } })
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.html()).toContain('border-danger-solid')
  })

  it('lets a consumer class beat the variant class', () => {
    const classes = mount(Input, {
      props: { class: 'border-success-solid', invalid: true },
    })
      .find('input')
      .classes()
    expect(classes).toContain('border-success-solid')
    expect(classes).not.toContain('border-danger-solid')
  })

  it('pads for a leading slot so the icon does not sit on the text', () => {
    const wrapper = mount(Input, { slots: { leading: '<span data-testid="icon" />' } })
    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
    expect(wrapper.find('input').classes()).toContain('pl-9')
  })

  it('passes unknown attributes through to the input, not the wrapper', () => {
    // inheritAttrs is off, so this would silently land on the positioning div.
    const wrapper = mount(Input, { attrs: { autocomplete: 'email', name: 'email' } })
    expect(wrapper.find('input').attributes('autocomplete')).toBe('email')
    expect(wrapper.find('input').attributes('name')).toBe('email')
  })

  describe('inside a Field', () => {
    function mountInField(
      fieldProps: Record<string, unknown>,
      inputProps: Record<string, unknown> = {}
    ) {
      return mount(
        defineComponent({
          setup: () => () => h(Field, fieldProps, { default: () => h(Input, inputProps) }),
        })
      )
    }

    it('inherits disabled', () => {
      expect(mountInField({ disabled: true }).find('input').attributes('disabled')).toBeDefined()
    })

    it('cannot be re-enabled from inside a disabled field', () => {
      // Same rule as `<fieldset disabled>`: a descendant has no way out.
      expect(
        mountInField({ disabled: true }, { disabled: false }).find('input').attributes('disabled')
      ).toBeDefined()
    })

    it('can set disabled on its own inside an enabled field', () => {
      expect(
        mountInField({}, { disabled: true }).find('input').attributes('disabled')
      ).toBeDefined()
    })

    it('inherits the invalid state from the field error', () => {
      expect(mountInField({ error: 'Required' }).find('input').attributes('aria-invalid')).toBe(
        'true'
      )
    })
  })

  it('works standalone, outside any Field', () => {
    // A bare input in a toolbar or a table cell is legitimate; the context is
    // optional rather than required.
    const wrapper = mount(Input, { props: { placeholder: 'Filter' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Filter')
    expect(wrapper.find('input').attributes('aria-describedby')).toBeUndefined()
  })
})
