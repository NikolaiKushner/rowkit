import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { Comment, defineComponent, h, ref } from 'vue'
import { Primitive } from './Primitive'

describe('Primitive', () => {
  it('renders a div by default', () => {
    expect(mount(Primitive).element.tagName).toBe('DIV')
  })

  it('renders the `as` element with attributes and slot', () => {
    const wrapper = mount(Primitive, {
      props: { as: 'button' },
      attrs: { type: 'button', class: 'x' },
      slots: { default: 'Save' },
    })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.classes()).toContain('x')
    expect(wrapper.text()).toBe('Save')
  })

  it('renders a void element without children', () => {
    const wrapper = mount(Primitive, { props: { as: 'input' }, slots: { default: 'ignored' } })
    expect(wrapper.element.tagName).toBe('INPUT')
    expect(wrapper.element.childNodes).toHaveLength(0)
  })

  it('renders a component passed as `as`', () => {
    const Inner = defineComponent({
      setup:
        (_, { slots }) =>
        () =>
          h('section', slots.default?.()),
    })
    expect(mount(Primitive, { props: { as: Inner }, slots: { default: 'x' } }).html()).toBe(
      '<section>x</section>'
    )
  })

  describe('as-child', () => {
    it('renders the child instead of a wrapper and merges attributes onto it', () => {
      const wrapper = mount(Primitive, {
        props: { asChild: true },
        attrs: { class: 'part', 'aria-busy': 'true' },
        slots: { default: () => h('a', { href: '/x', class: 'own' }, 'Link') },
      })
      expect(wrapper.element.tagName).toBe('A')
      expect(wrapper.attributes('href')).toBe('/x')
      expect(wrapper.attributes('aria-busy')).toBe('true')
      expect(wrapper.classes()).toEqual(expect.arrayContaining(['part', 'own']))
    })

    it('lets the child win a conflicting attribute', () => {
      const wrapper = mount(Primitive, {
        props: { asChild: true },
        attrs: { type: 'button' },
        slots: { default: () => h('button', { type: 'submit' }, 'Go') },
      })
      expect(wrapper.attributes('type')).toBe('submit')
    })

    it('keeps both listeners when part and child each handle the same event', async () => {
      const onPart = vi.fn()
      const onChild = vi.fn()
      const wrapper = mount(Primitive, {
        props: { asChild: true },
        attrs: { onClick: onPart },
        slots: { default: () => h('button', { onClick: onChild }, 'Go') },
      })
      await wrapper.trigger('click')
      expect(onPart).toHaveBeenCalledOnce()
      expect(onChild).toHaveBeenCalledOnce()
    })

    it('skips comments and flattens fragments to find the child', () => {
      const wrapper = mount(Primitive, {
        props: { asChild: true },
        attrs: { class: 'part' },
        slots: { default: () => [h(Comment), [h('span', 'inner')]] },
      })
      expect(wrapper.find('span').classes()).toContain('part')
    })

    it('renders nothing when the slot is empty', () => {
      expect(mount(Primitive, { props: { asChild: true } }).html()).toBe('')
    })

    it('keeps the child ref from shadowing the part', () => {
      const childRef = ref<HTMLElement | null>(null)
      const wrapper = mount(Primitive, {
        props: { asChild: true },
        slots: { default: () => h('button', { ref: childRef }, 'Go') },
      })
      expect(wrapper.element.tagName).toBe('BUTTON')
    })
  })
})
