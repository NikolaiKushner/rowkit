import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
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

  it('is quietly invalid: aria-invalid and the error mark, no red', () => {
    const wrapper = mount(Input, { props: { invalid: true } })
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('[data-slot="input-error-icon"]').exists()).toBe(true)
    // The bevel is the same as a valid field's.
    expect(wrapper.get('[data-slot="input-frame"]').classes()).toContain('shadow-sunken')
    expect(wrapper.html()).not.toContain('danger')
  })

  it('shows no error mark while valid', () => {
    expect(mount(Input).find('[data-slot="input-error-icon"]').exists()).toBe(false)
  })

  it('puts the class on the frame, the box the user sees', () => {
    const wrapper = mount(Input, { props: { class: 'w-56 shadow-none' } })
    const frame = wrapper.get('[data-slot="input-frame"]').classes()
    expect(frame).toContain('w-56')
    expect(frame).toContain('shadow-none')
    expect(frame).not.toContain('shadow-sunken')
  })

  it('renders a leading slot inside the frame, before the text', () => {
    const wrapper = mount(Input, { slots: { leading: '<span data-testid="icon" />' } })
    const frame = wrapper.get('[data-slot="input-frame"]').element
    expect(frame.firstElementChild?.querySelector('[data-testid="icon"]')).not.toBeNull()
  })

  describe('search', () => {
    it('shows the magnifier', () => {
      const wrapper = mount(Input, { props: { type: 'search' } })
      expect(wrapper.findComponent({ name: 'RkSearchIcon' }).exists()).toBe(true)
    })

    it('lets a leading slot replace the magnifier', () => {
      const wrapper = mount(Input, {
        props: { type: 'search' },
        slots: { leading: '<span data-testid="icon" />' },
      })
      expect(wrapper.findComponent({ name: 'RkSearchIcon' }).exists()).toBe(false)
    })

    it('clears on Escape and keeps the key from reaching a dialog', async () => {
      const outer = vi.fn()
      const wrapper = mount(Input, {
        props: { type: 'search', modelValue: 'ada' },
        attachTo: document.body,
      })
      document.body.addEventListener('keydown', outer)
      await wrapper.find('input').trigger('keydown', { key: 'Escape' })
      expect(wrapper.emitted('update:modelValue')).toEqual([['']])
      expect(outer).not.toHaveBeenCalled()
      document.body.removeEventListener('keydown', outer)
      wrapper.unmount()
    })

    it('lets Escape through when there is nothing to clear', async () => {
      const outer = vi.fn()
      const wrapper = mount(Input, {
        props: { type: 'search', modelValue: '' },
        attachTo: document.body,
      })
      document.body.addEventListener('keydown', outer)
      await wrapper.find('input').trigger('keydown', { key: 'Escape' })
      expect(outer).toHaveBeenCalledOnce()
      document.body.removeEventListener('keydown', outer)
      wrapper.unmount()
    })
  })

  describe('number', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    function mountNumber(props: Record<string, unknown> = {}) {
      return mount(Input, { props: { type: 'number', modelValue: '5', ...props } })
    }

    it('draws spin buttons hidden from assistive technology', () => {
      const spin = mountNumber().get('[data-slot="input-spin"]')
      // The native input is the spinbutton; the arrows are for the pointer.
      expect(spin.attributes('aria-hidden')).toBe('true')
      expect(spin.find('button').exists()).toBe(false)
    })

    it('steps the value up and down and updates the model', async () => {
      const wrapper = mountNumber()
      const [up, down] = wrapper.get('[data-slot="input-spin"]').findAll('span')
      await up?.trigger('pointerdown')
      await up?.trigger('pointerup')
      expect(wrapper.find('input').element.value).toBe('6')
      await down?.trigger('pointerdown')
      expect(wrapper.find('input').element.value).toBe('5')
      expect(wrapper.emitted('update:modelValue')).toEqual([[6], [5]])
    })

    it('repeats while held, as Windows does', async () => {
      vi.useFakeTimers()
      const wrapper = mountNumber()
      const up = wrapper.get('[data-slot="input-spin"]').findAll('span')[0]
      await up?.trigger('pointerdown')
      vi.advanceTimersByTime(400 + 50 * 3)
      window.dispatchEvent(new Event('pointerup'))
      vi.advanceTimersByTime(500)
      expect(wrapper.find('input').element.value).toBe('9')
    })

    it('shows the held button pressed in, then lets it go', async () => {
      const wrapper = mountNumber()
      const up = () => wrapper.get('[data-slot="input-spin"]').findAll('span')[0]
      await up()?.trigger('pointerdown')
      expect(up()?.attributes('data-pressed')).toBeDefined()
      window.dispatchEvent(new Event('pointerup'))
      await nextTick()
      expect(up()?.attributes('data-pressed')).toBeUndefined()
    })

    it.each([{ disabled: true }, { readonly: true }])('does not step when %o', async (props) => {
      const wrapper = mountNumber(props)
      await wrapper.get('[data-slot="input-spin"]').findAll('span')[0]?.trigger('pointerdown')
      expect(wrapper.find('input').element.value).toBe('5')
    })
  })

  describe('date', () => {
    it('opens the native picker from the drop button', async () => {
      const showPicker = vi.fn()
      const wrapper = mount(Input, { props: { type: 'date' } })
      wrapper.find('input').element.showPicker = showPicker
      await wrapper.get('[data-slot="input-drop"]').trigger('pointerdown')
      expect(showPicker).toHaveBeenCalledOnce()
    })

    it('stays usable where the picker cannot be opened from script', async () => {
      const wrapper = mount(Input, { props: { type: 'date' }, attachTo: document.body })
      wrapper.find('input').element.showPicker = () => {
        throw new DOMException('Not allowed', 'NotAllowedError')
      }
      await wrapper.get('[data-slot="input-drop"]').trigger('pointerdown')
      expect(document.activeElement).toBe(wrapper.find('input').element)
      wrapper.unmount()
    })
  })

  it.each(['text', 'email', 'password'] as const)('%s has no buttons', (type) => {
    const wrapper = mount(Input, { props: { type } })
    expect(wrapper.find('[data-slot="input-spin"]').exists()).toBe(false)
    expect(wrapper.find('[data-slot="input-drop"]').exists()).toBe(false)
  })

  it('passes unknown attributes through to the input, not the wrapper', () => {
    // inheritAttrs is off, so this would silently land on the frame.
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

    const frame = (wrapper: ReturnType<typeof mountInField>) =>
      wrapper.get('[data-slot="input-frame"]').classes()

    it('inherits size from the field when its own size is omitted', () => {
      expect(frame(mountInField({ size: 'sm' }))).toContain('h-[21px]')
      expect(frame(mountInField({ size: 'lg' }))).toContain('h-[27px]')
    })

    it('keeps an explicit size over the field size', () => {
      expect(frame(mountInField({ size: 'sm' }, { size: 'lg' }))).toContain('h-[27px]')
      expect(frame(mountInField({ size: 'sm' }, { size: 'lg' }))).not.toContain('h-[21px]')
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
