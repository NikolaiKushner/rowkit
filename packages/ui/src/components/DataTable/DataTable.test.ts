import { mount } from '@vue/test-utils'
import type { Component } from 'vue'
import { describe, expect, it } from 'vitest'
import RawDataTable from './DataTable.vue'
import { columnId, isFieldColumn, type DataTableColumn } from './types'

interface User {
  id: number
  name: string
  role: string
  seats: number
}

const rows: User[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Owner', seats: 3 },
  { id: 2, name: 'Grace Hopper', role: 'Admin', seats: 12 },
  { id: 3, name: 'Alan Turing', role: 'Member', seats: 1 },
]

const columns: DataTableColumn<User>[] = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'seats', header: 'Seats', align: 'end' },
]

// A generic SFC does not satisfy the plain `Component` shape `mount` expects.
const DataTable = RawDataTable as unknown as Component

function setup(props: Record<string, unknown> = {}) {
  return mount(DataTable, {
    props: { rows, columns, rowKey: 'id', caption: 'Users', ...props },
  })
}

describe('DataTable', () => {
  describe('rendering', () => {
    it('renders a header cell per column', () => {
      const headers = setup().findAll('th')
      expect(headers).toHaveLength(3)
      expect(headers.map((h) => h.text())).toEqual(['Name', 'Role', 'Seats'])
    })

    it('renders a row per record', () => {
      expect(setup().findAll('tbody tr')).toHaveLength(3)
    })

    it('reads the field named by the column key', () => {
      const cells = setup().findAll('tbody tr')[0]?.findAll('td')
      expect(cells?.map((c) => c.text())).toEqual(['Ada Lovelace', 'Owner', '3'])
    })

    it('marks header cells as column scope', () => {
      // Without scope, a screen reader cannot associate a cell with its heading.
      expect(setup().find('th').attributes('scope')).toBe('col')
    })

    it('never renders an empty header cell', () => {
      // An unnamed column is one a screen reader cannot announce.
      const el = setup({
        columns: [{ id: 'actions', header: 'Actions', headerSrOnly: true }],
      })
      const header = el.find('th')
      expect(header.text()).toBe('Actions')
      expect(header.find('.sr-only').exists()).toBe(true)
    })

    it('shows the header text by default', () => {
      expect(setup().find('th').find('.sr-only').exists()).toBe(false)
    })

    it('aligns a column when asked', () => {
      const header = setup().findAll('th')[2]
      expect(header?.classes()).toContain('text-end')
    })

    it('applies a column width as a style', () => {
      const el = setup({ columns: [{ key: 'name', header: 'Name', width: '12rem' }] })
      expect(el.find('th').attributes('style')).toContain('width: 12rem')
    })
  })

  describe('cell values', () => {
    it('renders numbers and booleans', () => {
      const el = setup({
        rows: [{ id: 1, count: 0, active: false }],
        columns: [
          { key: 'count', header: 'Count' },
          { key: 'active', header: 'Active' },
        ],
      })
      // Zero and false must render, not vanish through falsiness.
      expect(el.findAll('tbody td').map((c) => c.text())).toEqual(['0', 'false'])
    })

    it('renders nothing for null or undefined', () => {
      const el = setup({
        rows: [{ id: 1, note: null }],
        columns: [{ key: 'note', header: 'Note' }],
      })
      expect(el.find('tbody td').text()).toBe('')
    })

    it('renders nothing rather than "[object Object]" for a non-primitive', () => {
      // A blank cell makes the missing slot obvious; the alternative ships noise.
      const el = setup({
        rows: [{ id: 1, meta: { a: 1 } }],
        columns: [{ key: 'meta', header: 'Meta' }],
      })
      expect(el.find('tbody td').text()).toBe('')
    })
  })

  describe('slots', () => {
    it('renders a per-column cell slot', () => {
      const el = mount(DataTable, {
        props: { rows, columns, rowKey: 'id', caption: 'Users' },
        slots: { 'cell:role': '<template #[`cell:role`]="{ value }">[{{ value }}]</template>' },
      })
      expect(el.text()).toContain('[Owner]')
    })

    it('falls back to the general cell slot', () => {
      const el = mount(DataTable, {
        props: { rows: rows.slice(0, 1), columns, rowKey: 'id', caption: 'Users' },
        slots: { cell: '<template #cell="{ value }">·{{ value }}·</template>' },
      })
      expect(el.text()).toContain('·Ada Lovelace·')
      expect(el.text()).toContain('·Owner·')
    })

    it('prefers the per-column slot over the general one', () => {
      const el = mount(DataTable, {
        props: { rows: rows.slice(0, 1), columns, rowKey: 'id', caption: 'Users' },
        slots: {
          cell: '<template #cell="{ value }">general-{{ value }}</template>',
          'cell:role': '<template #[`cell:role`]="{ value }">column-{{ value }}</template>',
        },
      })
      expect(el.text()).toContain('column-Owner')
      expect(el.text()).toContain('general-Ada Lovelace')
    })

    it('supports a column with no field behind it', () => {
      const el = mount(DataTable, {
        props: {
          rows: rows.slice(0, 1),
          columns: [...columns, { id: 'actions', header: 'Actions' }],
          rowKey: 'id',
          caption: 'Users',
        },
        slots: { 'cell:actions': '<template #[`cell:actions`]><button>Edit</button></template>' },
      })
      expect(el.find('tbody button').text()).toBe('Edit')
    })
  })

  describe('loading', () => {
    it('replaces the body with placeholder rows', () => {
      const el = setup({ loading: true, loadingRows: 4 })
      expect(el.findAll('tbody tr')).toHaveLength(4)
      expect(el.find('tbody').attributes('aria-busy')).toBe('true')
    })

    it('announces once for the table, not once per cell', () => {
      const el = setup({ loading: true })
      expect(el.findAll('[role="status"]')).toHaveLength(1)
      expect(el.find('[role="status"]').text()).toBe('Loading')
    })

    it('keeps the live region present when idle so a change is announced', () => {
      // A region added at the same moment as its content often goes unread.
      const el = setup()
      expect(el.find('[role="status"]').exists()).toBe(true)
      expect(el.find('[role="status"]').text()).toBe('')
    })

    it('takes precedence over the empty state', () => {
      const el = setup({ rows: [], loading: true })
      expect(el.text()).not.toContain('Nothing to show')
    })
  })

  describe('empty', () => {
    it('renders an empty state spanning every column', () => {
      const el = setup({ rows: [] })
      expect(el.find('tbody td').attributes('colspan')).toBe('3')
      expect(el.text()).toContain('Nothing to show')
    })

    it('takes a custom title and description', () => {
      const el = setup({ rows: [], emptyTitle: 'No users', emptyDescription: 'Invite someone.' })
      expect(el.text()).toContain('No users')
      expect(el.text()).toContain('Invite someone.')
    })

    it('nests the empty heading below the page, not at h2', () => {
      expect(setup({ rows: [] }).find('h3').exists()).toBe(true)
    })

    it('can be replaced through the slot', () => {
      const el = mount(DataTable, {
        props: { rows: [], columns, rowKey: 'id', caption: 'Users' },
        slots: { empty: '<p>Custom</p>' },
      })
      expect(el.text()).toContain('Custom')
      expect(el.text()).not.toContain('Nothing to show')
    })
  })

  describe('caption', () => {
    it('names the table and is hidden by default', () => {
      const caption = setup().find('caption')
      expect(caption.text()).toBe('Users')
      expect(caption.classes()).toContain('sr-only')
    })

    it('can be shown', () => {
      expect(setup({ captionVisible: true }).find('caption').classes()).not.toContain('sr-only')
    })
  })

  describe('sticky columns', () => {
    it('pins a column to the start edge', () => {
      const el = setup({ columns: [{ key: 'name', header: 'Name', sticky: true }] })
      expect(el.find('tbody td').classes()).toContain('sticky')
      expect(el.find('tbody td').classes()).toContain('left-0')
    })

    it('gives a pinned body cell its own background so rows do not show through', () => {
      const el = setup({ columns: [{ key: 'name', header: 'Name', sticky: true }] })
      expect(el.find('tbody td').classes()).toContain('bg-surface')
    })

    it('has no scroll shadow until the table is actually scrolled', () => {
      const el = setup({ columns: [{ key: 'name', header: 'Name', sticky: true }] })
      expect(el.find('tbody td').classes()).not.toContain('shadow-scroll-x')
    })
  })

  it('adds no tab stop when the table does not scroll', () => {
    // jsdom reports no overflow, which is the non-scrolling case: a focusable
    // region here would be a tab stop that does nothing.
    const el = setup()
    expect(el.attributes('tabindex')).toBeUndefined()
    expect(el.attributes('role')).toBeUndefined()
  })

  it('does not highlight rows on hover unless they do something', () => {
    expect(setup().find('tbody tr').classes()).not.toContain('hover:bg-surface-hover')
    expect(setup({ hoverable: true }).find('tbody tr').classes()).toContain(
      'hover:bg-surface-hover'
    )
  })

  describe('column identity', () => {
    it('uses the key as the slot name by default', () => {
      expect(columnId<User>({ key: 'name', header: 'Name' })).toBe('name')
    })

    it('prefers an explicit id', () => {
      expect(columnId<User>({ key: 'name', header: 'Name', id: 'full-name' })).toBe('full-name')
    })

    it('uses the id for a column with no field', () => {
      expect(columnId<User>({ id: 'actions', header: 'Actions' })).toBe('actions')
    })

    it('distinguishes field columns from custom ones', () => {
      expect(isFieldColumn<User>({ key: 'name', header: 'Name' })).toBe(true)
      expect(isFieldColumn<User>({ id: 'actions', header: 'Actions' })).toBe(false)
    })
  })

  describe('class forwarding', () => {
    it('merges a consumer class onto the scroll container', () => {
      expect(setup({ class: 'rounded-none' }).classes()).toContain('rounded-none')
    })

    it('drops the radius it replaces rather than emitting both', () => {
      expect(setup({ class: 'rounded-none' }).classes()).not.toContain('rounded-md')
    })
  })
})
