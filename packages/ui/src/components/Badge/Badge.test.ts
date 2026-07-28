import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Badge from './Badge.vue'

describe('Badge', () => {
  it('renders its content', () => {
    expect(mount(Badge, { slots: { default: 'Active' } }).text()).toBe('Active')
  })

  it('defaults to a neutral subtle badge', () => {
    const html = mount(Badge, { slots: { default: 'x' } }).html()
    expect(html).toContain('bg-neutral-subtle')
    expect(html).toContain('text-neutral-on-subtle')
  })

  it.each([
    ['neutral', 'bg-neutral-solid'],
    ['primary', 'bg-primary-solid'],
    ['success', 'bg-success-solid'],
    ['warning', 'bg-warning-solid'],
    ['danger', 'bg-danger-solid'],
  ] as const)('%s solid uses the %s token', (variant, expected) => {
    const html = mount(Badge, { props: { variant, appearance: 'solid' }, slots: { default: 'x' } })
    expect(html.html()).toContain(expected)
  })

  it('renders outline without a fill', () => {
    const html = mount(Badge, {
      props: { variant: 'danger', appearance: 'outline' },
      slots: { default: 'x' },
    }).html()
    expect(html).toContain('bg-transparent')
    expect(html).toContain('border-danger-border')
  })

  it('hides the dot from assistive technology', () => {
    const dot = mount(Badge, { props: { dot: true }, slots: { default: 'x' } }).find(
      '[aria-hidden]'
    )
    expect(dot.exists()).toBe(true)
    expect(dot.classes()).toContain('rounded-full')
  })

  it('omits the dot by default', () => {
    expect(
      mount(Badge, { slots: { default: 'x' } })
        .find('[aria-hidden]')
        .exists()
    ).toBe(false)
  })

  it('lets a consumer class beat the variant class', () => {
    // Hard rule 8: the incoming class has to win, not merely be appended.
    const classes = mount(Badge, {
      props: { variant: 'danger', appearance: 'solid', class: 'bg-success-solid' },
      slots: { default: 'x' },
    }).classes()
    expect(classes).toContain('bg-success-solid')
    expect(classes).not.toContain('bg-danger-solid')
  })

  it('renders as a span by default and honours `as`', () => {
    expect(mount(Badge, { slots: { default: 'x' } }).element.tagName).toBe('SPAN')
    expect(mount(Badge, { props: { as: 'div' }, slots: { default: 'x' } }).element.tagName).toBe(
      'DIV'
    )
  })
})
