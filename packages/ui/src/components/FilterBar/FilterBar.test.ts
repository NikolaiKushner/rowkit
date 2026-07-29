import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import FilterBar from './FilterBar.vue'
import type { FilterChip } from './types'

const filters: FilterChip[] = [
  { id: 'role', label: 'Role', value: 'Admin' },
  { id: 'status', label: 'Status', value: 'Active' },
  { id: 'team', label: 'Team', value: 'Platform' },
]

function setup(props: Record<string, unknown> = {}) {
  return mount(FilterBar, { props, attachTo: document.body })
}

const removeButtons = (el: ReturnType<typeof setup>) => el.findAll('[data-rk-chip-remove]')

describe('FilterBar', () => {
  describe('chips', () => {
    it('renders one per applied filter', () => {
      expect(removeButtons(setup({ filters }))).toHaveLength(3)
    })

    it('reads as "field: value"', () => {
      expect(setup({ filters }).text()).toContain('Role: Admin')
    })

    it('falls back to the label alone when there is no value', () => {
      const el = setup({ filters: [{ id: 'a', label: 'Archived' }] })
      expect(el.text()).toContain('Archived')
      expect(el.text()).not.toContain(':')
    })

    it('names the remove control after the filter it clears', () => {
      // "Remove" alone is ambiguous when there are three of them.
      const button = setup({ filters }).find('[data-rk-chip-remove]')
      expect(button.attributes('aria-label')).toBe('Remove Role: Admin filter')
    })

    it('omits the remove control for a filter that cannot be cleared', () => {
      const el = setup({
        filters: [{ id: 'tenant', label: 'Tenant', value: 'Acme', removable: false }],
      })
      expect(removeButtons(el)).toHaveLength(0)
      expect(el.text()).toContain('Tenant: Acme')
    })

    it('emits the id, not the index', () => {
      const el = setup({ filters })
      void removeButtons(el)[1]?.trigger('click')
      expect(el.emitted('remove')?.[0]).toEqual(['status'])
    })

    it('renders no chip row when nothing is applied', () => {
      expect(removeButtons(setup())).toHaveLength(0)
    })
  })

  describe('focus after removal', () => {
    it('moves to the chip that took the removed one’s place', async () => {
      const el = setup({ filters })
      void removeButtons(el)[0]?.trigger('click')
      await el.setProps({ filters: filters.slice(1) })
      await nextTick()
      await nextTick()

      // Was "Status" at index 1; it is now index 0 and should hold focus.
      expect(document.activeElement?.getAttribute('aria-label')).toBe(
        'Remove Status: Active filter'
      )
    })

    it('falls back to the last chip when the final one is removed', async () => {
      const el = setup({ filters })
      void removeButtons(el)[2]?.trigger('click')
      await el.setProps({ filters: filters.slice(0, 2) })
      await nextTick()
      await nextTick()

      expect(document.activeElement?.getAttribute('aria-label')).toBe(
        'Remove Status: Active filter'
      )
    })

    it('falls back to the search box when the last chip goes', async () => {
      const el = setup({ filters: [filters[0]!] })
      void removeButtons(el)[0]?.trigger('click')
      await el.setProps({ filters: [] })
      await nextTick()
      await nextTick()

      expect(document.activeElement?.tagName).toBe('INPUT')
    })

    it('falls back to the region itself with nothing else to focus', async () => {
      const el = setup({ filters: [filters[0]!], searchable: false })
      void removeButtons(el)[0]?.trigger('click')
      await el.setProps({ filters: [] })
      await nextTick()
      await nextTick()

      // Better than dumping the user at the top of the document.
      expect(document.activeElement?.getAttribute('role')).toBe('search')
    })

    it('leaves focus alone when a filter disappears on its own', async () => {
      const el = setup({ filters })
      const before = document.activeElement
      await el.setProps({ filters: filters.slice(1) })
      await nextTick()
      await nextTick()

      // Nothing was dismissed here, so nothing took focus with it.
      expect(document.activeElement).toBe(before)
    })
  })

  describe('clear all', () => {
    it('appears only while filters are applied', () => {
      expect(setup().text()).not.toContain('Clear all')
      expect(setup({ filters }).text()).toContain('Clear all')
    })

    it('emits clear', () => {
      const el = setup({ filters })
      const clear = el.findAll('button').find((b) => b.text() === 'Clear all')
      void clear?.trigger('click')
      expect(el.emitted('clear')).toHaveLength(1)
    })
  })

  describe('result count', () => {
    it('is a live region so a change is announced', () => {
      const el = setup({ resultCount: 12 })
      const status = el.find('[role="status"]')
      expect(status.exists()).toBe(true)
      expect(status.text()).toBe('12 results')
    })

    it('says "1 result" rather than "1 results"', () => {
      expect(setup({ resultCount: 1 }).find('[role="status"]').text()).toBe('1 result')
    })

    it('says "0 results" rather than going missing', () => {
      expect(setup({ resultCount: 0 }).find('[role="status"]').text()).toBe('0 results')
    })

    it('is absent when no count is given', () => {
      expect(setup({ filters }).find('[role="status"]').exists()).toBe(false)
    })
  })

  describe('search', () => {
    it('renders a labelled search box', () => {
      const input = setup().find('input')
      expect(input.attributes('type')).toBe('search')
      expect(setup().text()).toContain('Search')
    })

    it('can be turned off', () => {
      expect(setup({ searchable: false }).find('input').exists()).toBe(false)
    })

    it('updates the model as the user types', async () => {
      const el = setup()
      await el.find('input').setValue('ada')
      expect(el.emitted('update:search')?.at(-1)).toEqual(['ada'])
    })
  })

  describe('region', () => {
    it('is a named search landmark', () => {
      const el = setup()
      expect(el.attributes('role')).toBe('search')
      expect(el.attributes('aria-label')).toBe('Filters')
    })

    it('takes a distinct name so two instances are not duplicate landmarks', () => {
      expect(setup({ label: 'User filters' }).attributes('aria-label')).toBe('User filters')
    })
  })

  describe('class forwarding', () => {
    it('merges a consumer class onto the root', () => {
      expect(setup({ class: 'gap-8' }).classes()).toContain('gap-8')
    })

    it('drops the gap it replaces rather than emitting both', () => {
      expect(setup({ class: 'gap-8' }).classes()).not.toContain('gap-3')
    })
  })
})
