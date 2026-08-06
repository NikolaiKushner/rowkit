import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Button from './Button.vue'

describe('Button', () => {
  it('renders a native button of type button', () => {
    const wrapper = mount(Button, { slots: { default: 'Save' } })
    expect(wrapper.element.tagName).toBe('BUTTON')
    // Not `submit`: a button that silently submits the surrounding form is the
    // more damaging default to get wrong.
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.text()).toBe('Save')
  })

  it.each([
    ['primary', 'bg-primary-solid'],
    ['secondary', 'bg-muted'],
    ['ghost', 'bg-transparent'],
    ['danger', 'bg-danger-solid'],
  ] as const)('%s uses the %s token', (variant, expected) => {
    expect(mount(Button, { props: { variant }, slots: { default: 'x' } }).html()).toContain(
      expected
    )
  })

  it('lets a consumer class beat the variant class', () => {
    // Assert on the class list, not the raw HTML: `bg-primary-solid` is a
    // substring of the `hover:` utility that legitimately survives the merge.
    const classes = mount(Button, {
      props: { variant: 'primary', class: 'bg-danger-solid' },
      slots: { default: 'x' },
    }).classes()
    expect(classes).toContain('bg-danger-solid')
    expect(classes).not.toContain('bg-primary-solid')
  })

  it('emits click when idle', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, { attrs: { onClick }, slots: { default: 'x' } })
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })

  describe('disabled', () => {
    it('sets the native disabled attribute', () => {
      const wrapper = mount(Button, { props: { disabled: true }, slots: { default: 'x' } })
      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('does not fire click', async () => {
      const onClick = vi.fn()
      const wrapper = mount(Button, {
        props: { disabled: true },
        attrs: { onClick },
        slots: { default: 'x' },
      })
      await wrapper.trigger('click')
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe('loading', () => {
    it('marks the button busy and shows a spinner', () => {
      const wrapper = mount(Button, { props: { loading: true }, slots: { default: 'Save' } })
      expect(wrapper.attributes('aria-busy')).toBe('true')
      expect(wrapper.find('svg.animate-spin').exists()).toBe(true)
    })

    it('keeps the label and stays focusable', () => {
      const wrapper = mount(Button, { props: { loading: true }, slots: { default: 'Save' } })
      // The accessible name must not change to "Loading", and the control must
      // not leave the tab order while a request is in flight.
      expect(wrapper.text()).toContain('Save')
      expect(wrapper.attributes('disabled')).toBeUndefined()
    })

    it('blocks activation', async () => {
      // Guards the keyboard and programmatic paths that
      // `pointer-events-none` cannot reach.
      const onClick = vi.fn()
      const wrapper = mount(Button, {
        props: { loading: true },
        attrs: { onClick },
        slots: { default: 'x' },
      })
      await wrapper.trigger('click')
      expect(onClick).not.toHaveBeenCalled()
    })

    it('replaces the leading slot rather than rendering both', () => {
      const wrapper = mount(Button, {
        props: { loading: true },
        slots: { default: 'x', leading: '<span data-testid="icon" />' },
      })
      expect(wrapper.find('[data-testid="icon"]').exists()).toBe(false)
      expect(wrapper.find('svg.animate-spin').exists()).toBe(true)
    })

    it('announces a loading label only when one is given', () => {
      const without = mount(Button, { props: { loading: true }, slots: { default: 'x' } })
      expect(without.find('[role="status"]').exists()).toBe(false)

      const withLabel = mount(Button, {
        props: { loading: true, loadingLabel: 'Saving' },
        slots: { default: 'x' },
      })
      expect(withLabel.find('[role="status"]').text()).toBe('Saving')
    })
  })

  it('keeps the trailing slot alongside the label', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Next', trailing: '<span data-testid="chevron" />' },
    })
    expect(wrapper.find('[data-testid="chevron"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Next')
  })

  describe('rendered as something other than a button', () => {
    it('uses aria-disabled, since a link has no disabled attribute', () => {
      const wrapper = mount(Button, {
        props: { as: 'a', disabled: true },
        slots: { default: 'x' },
      })
      expect(wrapper.attributes('aria-disabled')).toBe('true')
      expect(wrapper.attributes('disabled')).toBeUndefined()
      expect(wrapper.attributes('type')).toBeUndefined()
    })

    it('still blocks activation', async () => {
      const onClick = vi.fn()
      const wrapper = mount(Button, {
        props: { as: 'a', disabled: true },
        attrs: { onClick },
        slots: { default: 'x' },
      })
      await wrapper.trigger('click')
      expect(onClick).not.toHaveBeenCalled()
    })
  })
})
