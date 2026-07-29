import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import TablePagination from './TablePagination.vue'

function setup(props: Record<string, unknown> = {}) {
  return mount(TablePagination, { props: { total: 247, ...props } })
}

describe('TablePagination', () => {
  describe('summary', () => {
    it('reports the first page range', () => {
      expect(setup().find('p').text()).toBe('1–10 of 247')
    })

    it('reports a middle page range', () => {
      expect(setup({ page: 3 }).find('p').text()).toBe('21–30 of 247')
    })

    it('clamps the last page to the total', () => {
      // 25 * 10 = 250, but there are only 247 rows.
      expect(setup({ page: 25 }).find('p').text()).toBe('241–247 of 247')
    })

    it('reads sensibly with no rows at all', () => {
      // Not "1–0 of 0".
      expect(setup({ total: 0 }).find('p').text()).toBe('0 of 0')
    })

    it('handles a single partial page', () => {
      expect(setup({ total: 3 }).find('p').text()).toBe('1–3 of 3')
    })

    it('can be replaced through the slot', () => {
      const el = mount(TablePagination, {
        props: { total: 247, page: 2 },
        slots: {
          summary: `<template #summary="{ from, to, total }">{{ from }}/{{ to }}/{{ total }}</template>`,
        },
      })
      expect(el.find('p').text()).toBe('11/20/247')
    })

    it('can be hidden', () => {
      expect(setup({ hideSummary: true }).find('p').exists()).toBe(false)
    })
  })

  describe('it never moves the page by itself', () => {
    // The component reports; the application decides. A second decision taken
    // on the consumer's behalf is how "why did my page jump" bugs happen.

    it('leaves the page alone when the size grows', async () => {
      const el = setup({ page: 9, pageSize: 10 })
      await el.setProps({ pageSize: 25 })
      await nextTick()
      expect(el.emitted('update:page')).toBeUndefined()
    })

    it('leaves the page alone even when it now runs past the end', async () => {
      // Page 9 of 10-row pages does not exist at 100 per page. Still not ours
      // to fix — the application resets to 1 if that is what it wants.
      const el = setup({ total: 30, page: 9, pageSize: 10 })
      await el.setProps({ pageSize: 100 })
      await nextTick()
      expect(el.emitted('update:page')).toBeUndefined()
    })

    it('leaves the page alone when the total collapses', async () => {
      const el = setup({ page: 9, pageSize: 10 })
      await el.setProps({ total: 12 })
      await nextTick()
      expect(el.emitted('update:page')).toBeUndefined()
    })

    it('emits nothing at all when the total drops to zero', async () => {
      const el = setup({ page: 5, pageSize: 10 })
      await el.setProps({ total: 0 })
      await nextTick()
      expect(el.emitted('update:page')).toBeUndefined()
    })
  })

  describe('nothing to page through', () => {
    it('disables the controls rather than hiding them', () => {
      // Layout stability beats minimalism; the row keeps its height.
      const el = setup({ total: 0 })
      const controls = el.findAll('nav button')
      expect(controls.length).toBeGreaterThan(0)
      expect(controls.every((b) => b.attributes('disabled') !== undefined)).toBe(true)
      expect(el.find('p').text()).toBe('0 of 0')
    })

    it('leaves them operable when there are rows', () => {
      const enabled = setup().findAll('nav button')
      expect(enabled.some((b) => b.attributes('disabled') === undefined)).toBe(true)
    })
  })

  describe('navigation', () => {
    it('is a labelled navigation region', () => {
      const nav = setup().find('nav')
      expect(nav.exists()).toBe(true)
      expect(nav.attributes('aria-label')).toBe('Pagination')
    })

    it('takes a distinct name so two instances are not duplicate landmarks', () => {
      // Pagination above and below a long table is a normal layout, and two
      // landmarks sharing one name is an axe `landmark-unique` violation.
      const nav = setup({ label: 'Users pagination (bottom)' }).find('nav')
      expect(nav.attributes('aria-label')).toBe('Users pagination (bottom)')
    })

    it('marks the current page with aria-current', () => {
      const current = setup({ page: 3 }).findAll('[aria-current="page"]')
      expect(current).toHaveLength(1)
      expect(current[0]?.text()).toBe('3')
    })

    it('styles the current page as filled, not merely bold', () => {
      const current = setup({ page: 3 }).find('[aria-current="page"]')
      expect(current.classes()).toContain('bg-primary-solid')
    })

    it('names the previous and next controls', () => {
      const el = setup()
      expect(el.find('[aria-label="Previous page"]').exists()).toBe(true)
      expect(el.find('[aria-label="Next page"]').exists()).toBe(true)
    })

    it('shows the first and last page so the extent is visible', () => {
      // Reka's own default renders only the sibling window — "11 12 13" — which
      // tells a table user neither how far the data runs nor how to reach it.
      const labels = setup({ page: 12, siblingCount: 1 })
        .findAll('nav button')
        .map((n) => n.text())
      expect(labels).toContain('1')
      expect(labels).toContain('25')
    })

    it('hides the ellipsis from assistive technology', () => {
      // Purely a device for keeping the row short.
      const el = setup({ page: 12, siblingCount: 1 })
      const ellipses = el.findAll('[aria-hidden="true"]').filter((n) => n.text() === '…')
      expect(ellipses.length).toBeGreaterThan(0)
    })

    it('omits the edges when the range already reaches them', () => {
      const labels = setup({ total: 30, page: 2 })
        .findAll('nav button')
        .map((n) => n.text())
      expect(labels.filter((l) => l === '1')).toHaveLength(1)
    })
  })

  describe('rows per page', () => {
    it('renders a labelled control', () => {
      expect(setup().text()).toContain('Rows per page')
    })

    it('can be hidden', () => {
      expect(setup({ hidePageSize: true }).text()).not.toContain('Rows per page')
    })
  })

  describe('class forwarding', () => {
    it('merges a consumer class onto the root', () => {
      expect(setup({ class: 'gap-8' }).classes()).toContain('gap-8')
    })

    it('drops the gap it replaces rather than emitting both', () => {
      expect(setup({ class: 'gap-x-8' }).classes()).not.toContain('gap-x-4')
    })
  })
})
