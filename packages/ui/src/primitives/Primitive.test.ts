import { mount } from '@vue/test-utils'
import { Primitive as RekaPrimitive } from 'reka-ui'
import { describe, expect, it, vi } from 'vitest'
import { Comment, defineComponent, h, ref, type Component } from 'vue'
import { Primitive } from './Primitive'

/** Mounts `component` with the same props, attrs and slot, and returns its HTML. */
function render(component: Component, props: Record<string, unknown>, slot?: () => unknown) {
  return mount(component, {
    props,
    attrs: { class: 'part', 'data-slot': 'x' },
    slots: { default: slot ?? (() => 'label') },
  }).html()
}

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

  /*
   * The point of owning this component is to drop Reka from the simple parts
   * without changing a single rendered byte. While Reka is still installed
   * for Select and Tooltip, pin that equivalence directly.
   */
  describe('matches Reka UI’s Primitive', () => {
    const cases: [string, Record<string, unknown>, (() => unknown) | undefined][] = [
      ['default element', {}, undefined],
      ['as a tag', { as: 'section' }, undefined],
      ['as a void tag', { as: 'img' }, undefined],
      [
        'as-child with an element',
        { asChild: true },
        () => h('a', { href: '/x', class: 'own' }, 'x'),
      ],
      ['as-child with surrounding text', { asChild: true }, () => [h('em', 'first'), 'tail']],
    ]

    it.each(cases)('%s', (_label, props, slot) => {
      expect(render(Primitive, props, slot)).toBe(render(RekaPrimitive, props, slot))
    })
  })
})
