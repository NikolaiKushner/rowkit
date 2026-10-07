import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { Component } from 'vue'
import RawProgressBar from './ProgressBar.vue'

const ProgressBar = RawProgressBar as unknown as Component

const fill = (el: ReturnType<typeof mount<Component>>) =>
  el
    .find<HTMLElement>('[data-slot="progress-bar-fill"]')
    .element.style.getPropertyValue('--rk-progress')

describe('ProgressBar', () => {
  it('is a progressbar with its range and value', () => {
    const el = mount(ProgressBar, { props: { value: 60 }, attrs: { 'aria-label': 'Upload' } })
    expect(el.attributes('role')).toBe('progressbar')
    expect(el.attributes('aria-valuemin')).toBe('0')
    expect(el.attributes('aria-valuemax')).toBe('100')
    expect(el.attributes('aria-valuenow')).toBe('60')
    expect(el.attributes('aria-label')).toBe('Upload')
  })

  it('fills to the value as a share of max', () => {
    expect(fill(mount(ProgressBar, { props: { value: 3, max: 12 } }))).toBe('25%')
  })

  it('clamps a value outside the range', () => {
    const over = mount(ProgressBar, { props: { value: 140 } })
    expect(over.attributes('aria-valuenow')).toBe('100')
    expect(fill(over)).toBe('100%')
    const under = mount(ProgressBar, { props: { value: -5 } })
    expect(under.attributes('aria-valuenow')).toBe('0')
    expect(fill(under)).toBe('0%')
  })

  it('rounds the fill down to whole blocks where the browser can', () => {
    // `--spacing-progress-period` is 10px in Windows 98: a block and its gap.
    const classes = mount(ProgressBar, { props: { value: 50 } })
      .find('[data-slot="progress-bar-fill"]')
      .classes()
    expect(classes).toContain(
      'supports-[width:round(down,1%,1px)]:w-[round(down,var(--rk-progress),var(--spacing-progress-period))]'
    )
  })

  it('merges a consumer class', () => {
    expect(mount(ProgressBar, { props: { value: 1, class: 'w-48' } }).classes()).toContain('w-48')
  })
})
