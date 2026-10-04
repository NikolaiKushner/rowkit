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

  it('chromatic subtle is a soft chip, not bare text', () => {
    const html = mount(Badge, {
      props: { variant: 'success', appearance: 'subtle' },
      slots: { default: 'x' },
    }).html()
    expect(html).toContain('bg-success-subtle')
    expect(html).toContain('border-success-border')
    expect(html).not.toContain('bg-transparent')
  })

  it('hides the dot from assistive technology', () => {
    const dot = mount(Badge, { props: { dot: true }, slots: { default: 'x' } }).find(
      '[aria-hidden]'
    )
    expect(dot.exists()).toBe(true)
    expect(dot.attributes('data-slot')).toBe('badge-dot')
  })

  it('draws the dot as a square in the variant colour', () => {
    const dot = mount(Badge, {
      props: { dot: true, variant: 'danger' },
      slots: { default: 'x' },
    }).get('[data-slot="badge-dot"]')
    expect(dot.classes()).toEqual(expect.arrayContaining(['size-[5px]', 'bg-danger-solid']))
    expect(dot.classes()).not.toContain('rounded-full')
  })

  it('takes the text colour on a solid badge, so it shows on the fill', () => {
    const dot = mount(Badge, {
      props: { dot: true, variant: 'danger', appearance: 'solid' },
      slots: { default: 'x' },
    }).get('[data-slot="badge-dot"]')
    expect(dot.classes()).toContain('bg-current')
    expect(dot.classes()).not.toContain('bg-danger-solid')
  })

  it('outlines the warning dot, which is too faint on its own', () => {
    const dot = mount(Badge, {
      props: { dot: true, variant: 'warning' },
      slots: { default: 'x' },
    }).get('[data-slot="badge-dot"]')
    expect(dot.classes()).toEqual(expect.arrayContaining(['border', 'border-border-strong']))
  })

  it('is square-cornered, flat and set in the UI face', () => {
    const classes = mount(Badge, { slots: { default: 'x' } }).classes()
    expect(classes).toEqual(expect.arrayContaining(['border', 'text-ui', 'font-normal']))
    expect(classes.some((c) => c.startsWith('rounded') || c.startsWith('shadow'))).toBe(false)
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
