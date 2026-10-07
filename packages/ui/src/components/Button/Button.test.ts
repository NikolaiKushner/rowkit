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
    ['default', 'shadow-raised-default'],
    ['secondary', 'shadow-raised'],
    ['ghost', 'bg-transparent'],
    ['destructive', 'text-danger-on-subtle'],
    ['link', 'text-link'],
  ] as const)('%s uses the %s token', (variant, expected) => {
    const classes = mount(Button, { props: { variant }, slots: { default: 'x' } }).classes()
    expect(classes).toContain(expected)
  })

  it('draws every state with a shadow token, and times changes by the theme', () => {
    // The transition lasts `--rk-duration-control`: 0ms in Windows 98, so
    // states still switch instantly there.
    const classes = mount(Button, { slots: { default: 'x' } }).classes()
    expect(classes).toContain('active:shadow-pressed')
    expect(classes).toContain('duration-(--rk-duration-control)')
    expect(classes.some((c) => /^duration-(?!\(--rk-)/.test(c))).toBe(false)
  })

  it('renders icon sizes as squares', () => {
    const classes = mount(Button, {
      props: { size: 'icon', variant: 'secondary' },
      slots: { default: 'x' },
      attrs: { 'aria-label': 'Open' },
    }).classes()
    expect(classes).toContain('size-icon-md')
  })

  it('lets a consumer class beat the variant class', () => {
    const classes = mount(Button, {
      props: { variant: 'secondary', class: 'shadow-none' },
      slots: { default: 'x' },
    }).classes()
    expect(classes).toContain('shadow-none')
    expect(classes).not.toContain('shadow-raised')
  })

  it('shifts the content, not the button, when pressed', () => {
    const content = mount(Button, { slots: { default: 'x' } }).get('[data-slot="button-content"]')
    // Padded right and bottom at rest, left and top while held: same box.
    expect(content.classes()).toEqual(
      expect.arrayContaining([
        'pr-(--rk-press-shift)',
        'pb-(--rk-press-shift)',
        'group-active/button:pl-(--rk-press-shift)',
        'group-active/button:pt-(--rk-press-shift)',
      ])
    )
  })

  it('draws the focus ring around the label', () => {
    const ring = mount(Button, { slots: { default: 'x' } }).get('[data-slot="button-focus"]')
    expect(ring.classes()).toContain('group-focus-visible/button:focus-label')
    expect(ring.text()).toBe('x')
  })

  it('rings the whole button too, for a theme that rings the control', () => {
    const classes = mount(Button, { slots: { default: 'x' } }).classes()
    expect(classes).toContain('focus-visible:focus-outer')
  })

  describe('pressed', () => {
    it('is not a toggle unless asked', () => {
      const wrapper = mount(Button, { slots: { default: 'x' } })
      expect(wrapper.attributes('aria-pressed')).toBeUndefined()
    })

    it.each([true, false])('announces pressed=%s', (pressed) => {
      const wrapper = mount(Button, { props: { pressed }, slots: { default: 'x' } })
      expect(wrapper.attributes('aria-pressed')).toBe(String(pressed))
    })

    it('draws on over the dither', () => {
      const classes = mount(Button, { props: { pressed: true }, slots: { default: 'x' } }).classes()
      expect(classes).toContain('aria-pressed:bg-dither')
    })
  })

  describe('as child', () => {
    it("puts the button's attributes on the consumer's element", () => {
      const wrapper = mount(Button, {
        props: { asChild: true, variant: 'secondary' },
        slots: { default: '<a href="/next">Next</a>' },
      })
      expect(wrapper.element.tagName).toBe('A')
      expect(wrapper.attributes('data-slot')).toBe('button')
      expect(wrapper.classes()).toContain('shadow-raised')
      expect(wrapper.find('[data-slot="button-content"]').exists()).toBe(false)
    })
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
    it('marks the button busy and shows the hourglass', () => {
      const wrapper = mount(Button, { props: { loading: true }, slots: { default: 'Save' } })
      expect(wrapper.attributes('aria-busy')).toBe('true')
      expect(wrapper.findComponent({ name: 'RkHourglassIcon' }).exists()).toBe(true)
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
      expect(wrapper.findComponent({ name: 'RkHourglassIcon' }).exists()).toBe(true)
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
