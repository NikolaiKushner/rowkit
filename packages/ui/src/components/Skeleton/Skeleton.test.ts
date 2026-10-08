import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Skeleton from './Skeleton.vue'

describe('Skeleton', () => {
  it('renders an 11px loading bar by default', () => {
    // `bg-loading` is the dither in Windows 98.
    const el = mount(Skeleton)
    expect(el.classes()).toEqual(expect.arrayContaining(['bg-loading', 'h-[11px]']))
  })

  it('takes its corners from the radius tokens — square in Windows 98 — except the circle', () => {
    for (const variant of ['text', 'rect'] as const) {
      const classes = mount(Skeleton, { props: { variant } }).classes()
      expect(classes.filter((c) => c.startsWith('rounded'))).toHaveLength(1)
      expect(classes).not.toContain('rounded-full')
    }
    expect(mount(Skeleton, { props: { variant: 'circle' } }).classes()).toContain('rounded-full')
  })

  it('every variant carries a visible default size', () => {
    // A placeholder that collapses to zero defeats the point — the layout
    // still jumps when the content arrives.
    for (const variant of ['text', 'circle', 'rect'] as const) {
      const classes = mount(Skeleton, { props: { variant } }).classes()
      expect(
        classes.some((c) => /^(h-|size-)/.test(c)),
        `${variant} has a height`
      ).toBe(true)
    }
  })

  describe('motion', () => {
    it('moves only when motion is safe, as the theme says', () => {
      // A bare animation would loop regardless of the user's setting. Which
      // one — the dither stepping, or a pulse — is `--rk-animate-loading`.
      const classes = mount(Skeleton).classes()
      expect(classes).toContain('motion-safe:animate-(--rk-animate-loading)')
      expect(classes.filter((c) => c.includes('animate-'))).toHaveLength(1)
    })

    it('drops the animation entirely when disabled', () => {
      expect(mount(Skeleton, { props: { animated: false } }).classes()).not.toContain(
        'motion-safe:animate-dither'
      )
    })
  })

  describe('accessibility', () => {
    it('is hidden from assistive technology by default', () => {
      // A loading table renders dozens of these; none of them should speak.
      const el = mount(Skeleton)
      expect(el.attributes('aria-hidden')).toBe('true')
      expect(el.attributes('role')).toBeUndefined()
    })

    it('announces as a busy status region when labelled', () => {
      const el = mount(Skeleton, { props: { label: 'Loading users' } })
      expect(el.attributes('role')).toBe('status')
      expect(el.attributes('aria-busy')).toBe('true')
      expect(el.attributes('aria-label')).toBe('Loading users')
      expect(el.attributes('aria-hidden')).toBeUndefined()
    })
  })

  describe('multi-line text', () => {
    it('renders one bar per line', () => {
      const el = mount(Skeleton, { props: { lines: 3 } })
      expect(el.findAll('span')).toHaveLength(3)
    })

    it('shortens the last bar', () => {
      const bars = mount(Skeleton, { props: { lines: 3 } }).findAll('span')
      expect(bars[0]?.classes()).toContain('w-full')
      expect(bars[2]?.classes()).toContain('w-3/4')
      expect(bars[2]?.classes()).not.toContain('w-full')
    })

    it('makes the root a container rather than a bar', () => {
      const el = mount(Skeleton, { props: { lines: 2 } })
      expect(el.classes()).toContain('flex')
      expect(el.classes()).not.toContain('bg-loading')
    })

    it('stays a single bar at one line', () => {
      const el = mount(Skeleton, { props: { lines: 1 } })
      expect(el.findAll('span')).toHaveLength(0)
      expect(el.classes()).toContain('bg-loading')
    })

    it('ignores lines for non-text variants', () => {
      // A stack of circles is not a thing anyone means by `lines`.
      const el = mount(Skeleton, { props: { variant: 'circle', lines: 3 } })
      expect(el.findAll('span')).toHaveLength(0)
      expect(el.classes()).toContain('rounded-full')
    })
  })

  describe('class forwarding', () => {
    it('lets a consumer override the variant size', () => {
      expect(mount(Skeleton, { props: { class: 'h-8' } }).classes()).toContain('h-8')
    })

    it('drops the class it replaces rather than emitting both', () => {
      // The whole point of routing through tailwind-merge.
      expect(mount(Skeleton, { props: { class: 'h-8' } }).classes()).not.toContain('h-4')
    })

    it('forwards class to the container when stacked', () => {
      expect(mount(Skeleton, { props: { lines: 2, class: 'gap-4' } }).classes()).toContain('gap-4')
    })
  })

  it('renders as the requested element', () => {
    expect(mount(Skeleton, { props: { as: 'span' } }).element.tagName).toBe('SPAN')
  })
})
