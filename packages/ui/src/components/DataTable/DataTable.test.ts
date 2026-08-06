import { mount } from '@vue/test-utils'
import type { Component } from 'vue'
import { describe, expect, it } from 'vitest'
import RawDataTable from './DataTable.vue'
import { columnId, compareSortable, isFieldColumn, nextSort, type DataTableColumn } from './types'

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
    props: { rows, columns, caption: 'Users', ...props },
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
        props: { rows, columns, caption: 'Users' },
        slots: { 'cell:role': '<template #[`cell:role`]="{ value }">[{{ value }}]</template>' },
      })
      expect(el.text()).toContain('[Owner]')
    })

    it('falls back to the general cell slot', () => {
      const el = mount(DataTable, {
        props: { rows: rows.slice(0, 1), columns, caption: 'Users' },
        slots: { cell: '<template #cell="{ value }">·{{ value }}·</template>' },
      })
      expect(el.text()).toContain('·Ada Lovelace·')
      expect(el.text()).toContain('·Owner·')
    })

    it('prefers the per-column slot over the general one', () => {
      const el = mount(DataTable, {
        props: { rows: rows.slice(0, 1), columns, caption: 'Users' },
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

    it('can be replaced through the loading slot', () => {
      const el = mount(DataTable, {
        props: { rows, columns, caption: 'Users', loading: true },
        slots: { loading: '<tr><td>Fetching…</td></tr>' },
      })
      expect(el.text()).toContain('Fetching…')
      expect(el.findAll('tbody tr')).toHaveLength(1)
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
        props: { rows: [], columns, caption: 'Users' },
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

    it('keeps a pinned header cell above the header cells that follow it', () => {
      /*
       * The header row establishes one stacking context; inside it the pinned
       * cell has to outrank its siblings. Without that they all sat on the same
       * layer, so the later ones in the DOM painted over the pinned one and
       * scrolling right slid `Email` straight across `Name` — while the pinned
       * body cells below stayed put, leaving the column without its heading.
       *
       * jsdom has no layout, so this asserts the structure that produces the
       * paint order rather than the paint order itself.
       */
      const el = setup({
        columns: [
          { key: 'name', header: 'Name', sticky: true },
          { key: 'role', header: 'Role' },
        ],
      })

      expect(el.find('thead tr').classes()).toContain('z-sticky')

      const [pinned, plain] = el.findAll('thead th').slice(-2)
      expect(pinned?.classes()).toContain('z-1')
      expect(plain?.classes()).not.toContain('z-1')

      // The layer belongs to the row now; a cell carrying it too would create a
      // second stacking context and put the cells back on equal footing.
      expect(pinned?.classes()).not.toContain('z-sticky')
    })

    it('gives a pinned body cell an opaque background so rows do not show through', () => {
      // Inherited from the row rather than hardcoded, so selected and hover
      // states are not painted over by the pinned column.
      const el = setup({ columns: [{ key: 'name', header: 'Name', sticky: true }] })
      expect(el.find('tbody td').classes()).toContain('bg-inherit')
      expect(el.find('tbody tr').classes()).toContain('bg-card')
    })

    it('lets a selected row show through its pinned cell', () => {
      const el = setup({
        columns: [{ key: 'name', header: 'Name', sticky: true }],
        selectable: 'multiple',
        selected: [1],
      })
      expect(el.find('tbody tr').classes()).toContain('bg-surface-selected')
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
    expect(setup().find('tbody tr').classes()).not.toContain('hover:bg-accent')
    expect(setup({ hoverable: true }).find('tbody tr').classes()).toContain('hover:bg-accent')
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

  describe('sorting', () => {
    const sortable: DataTableColumn<User>[] = [
      { key: 'name', header: 'Name', sortable: true },
      { key: 'role', header: 'Role' },
      { key: 'seats', header: 'Seats', sortable: true, align: 'end' },
    ]

    const names = (el: ReturnType<typeof setup>) =>
      el.findAll('tbody tr').map((r) => r.findAll('td')[0]?.text())

    it('makes only sortable headers into buttons', () => {
      // A `<th>` with a click handler is unreachable by keyboard.
      const el = setup({ columns: sortable })
      expect(el.findAll('th button')).toHaveLength(2)
    })

    it('marks a sortable column as unsorted rather than omitting aria-sort', () => {
      // `none` is what says "sortable, but not currently sorted".
      const headers = setup({ columns: sortable }).findAll('th')
      expect(headers[0]?.attributes('aria-sort')).toBe('none')
      expect(headers[1]?.attributes('aria-sort')).toBeUndefined()
    })

    it('reflects the active sort on the right column only', () => {
      const headers = setup({
        columns: sortable,
        sort: { key: 'seats', direction: 'desc' },
      }).findAll('th')
      expect(headers[0]?.attributes('aria-sort')).toBe('none')
      expect(headers[2]?.attributes('aria-sort')).toBe('descending')
    })

    it('labels the button with the column name alone', () => {
      // aria-sort already announces the state; repeating it says it twice.
      const el = setup({ columns: sortable, sort: { key: 'name', direction: 'asc' } })
      expect(el.find('th button').text()).toBe('Name')
    })

    describe('the cycle', () => {
      it('starts ascending', async () => {
        const el = setup({ columns: sortable })
        await el.find('th button').trigger('click')
        expect(el.emitted('update:sort')?.at(-1)).toEqual([{ key: 'name', direction: 'asc' }])
      })

      it('goes ascending to descending', async () => {
        const el = setup({ columns: sortable, sort: { key: 'name', direction: 'asc' } })
        await el.find('th button').trigger('click')
        expect(el.emitted('update:sort')?.at(-1)).toEqual([{ key: 'name', direction: 'desc' }])
      })

      it('returns to unsorted from descending', async () => {
        // Without a third step there is no way back to the server's own order.
        const el = setup({ columns: sortable, sort: { key: 'name', direction: 'desc' } })
        await el.find('th button').trigger('click')
        expect(el.emitted('update:sort')?.at(-1)).toEqual([undefined])
      })

      it('restarts ascending when a different column is chosen', async () => {
        const el = setup({ columns: sortable, sort: { key: 'name', direction: 'desc' } })
        await el.findAll('th button')[1]?.trigger('click')
        expect(el.emitted('update:sort')?.at(-1)).toEqual([{ key: 'seats', direction: 'asc' }])
      })

      it('ignores a click on a column that does not sort', () => {
        const el = setup({ columns: sortable })
        expect(el.findAll('th')[1]?.find('button').exists()).toBe(false)
      })
    })

    describe('manual mode', () => {
      it('leaves the rows in the order given', () => {
        const el = setup({ columns: sortable, sort: { key: 'name', direction: 'desc' } })
        expect(names(el)).toEqual(['Ada Lovelace', 'Grace Hopper', 'Alan Turing'])
      })
    })

    describe('the table never sorts its own rows', () => {
      it('renders them in the order given, whatever the sort says', () => {
        // Sorting lives in `useClientSort`. A table that reorders its own rows
        // would silently sort only the current page of a server-paged set.
        const el = setup({ columns: sortable, sort: { key: 'name', direction: 'desc' } })
        expect(names(el)).toEqual(['Ada Lovelace', 'Grace Hopper', 'Alan Turing'])
      })
    })
  })

  describe('the comparator', () => {
    it('sinks blanks in both directions', () => {
      // Nobody sorts a column to find the rows with nothing in it.
      expect(compareSortable(null, 'a', 'asc')).toBeGreaterThan(0)
      expect(compareSortable(null, 'a', 'desc')).toBeGreaterThan(0)
      expect(compareSortable(undefined, 1, 'desc')).toBeGreaterThan(0)
    })

    it('treats two blanks as equal', () => {
      expect(compareSortable(null, undefined, 'asc')).toBe(0)
    })

    it('compares strings by locale, not code point', () => {
      expect(compareSortable('Ärger', 'Beta', 'asc')).toBeLessThan(0)
    })

    it('compares dates chronologically', () => {
      const early = new Date('2020-01-01')
      const late = new Date('2024-01-01')
      expect(compareSortable(early, late, 'asc')).toBeLessThan(0)
      expect(compareSortable(early, late, 'desc')).toBeGreaterThan(0)
    })

    it('orders false before true', () => {
      expect(compareSortable(false, true, 'asc')).toBeLessThan(0)
    })
  })

  describe('the sort cycle helper', () => {
    it('walks asc, desc, off', () => {
      const first = nextSort<User>(undefined, 'name')
      expect(first).toEqual({ key: 'name', direction: 'asc' })
      const second = nextSort<User>(first, 'name')
      expect(second).toEqual({ key: 'name', direction: 'desc' })
      expect(nextSort<User>(second, 'name')).toBeUndefined()
    })

    it('resets to ascending on a new column', () => {
      expect(nextSort<User>({ key: 'name', direction: 'desc' }, 'seats')).toEqual({
        key: 'seats',
        direction: 'asc',
      })
    })
  })

  describe('row activation', () => {
    const clickable = () =>
      mount(DataTable, {
        props: { rows, columns, caption: 'Users', 'onRow:click': () => undefined },
      })

    it('stays out of the tab order with no listener', () => {
      // Otherwise every table in the library adds a tab stop per row.
      expect(setup().find('tbody tr').attributes('tabindex')).toBeUndefined()
    })

    it('becomes focusable once someone is listening', () => {
      expect(clickable().find('tbody tr').attributes('tabindex')).toBe('0')
    })

    it('emits the row on click', async () => {
      const el = clickable()
      await el.find('tbody tr').trigger('click')
      expect(el.emitted('row:click')?.[0]).toEqual([rows[0]])
    })

    it('activates on Enter and Space', async () => {
      for (const key of ['Enter', ' ']) {
        const el = clickable()
        await el.find('tbody tr').trigger('keydown', { key })
        expect(el.emitted('row:click'), key).toHaveLength(1)
      }
    })

    it('ignores other keys', async () => {
      const el = clickable()
      await el.find('tbody tr').trigger('keydown', { key: 'a' })
      expect(el.emitted('row:click')).toBeUndefined()
    })

    it('does not fire when a control inside the row is used', async () => {
      // The annoying-in-production bug: ticking the checkbox also opens the row.
      const el = mount(DataTable, {
        props: {
          rows,
          columns,
          caption: 'Users',
          selectable: 'multiple',
          'onRow:click': () => undefined,
        },
      })
      await el.find('tbody [role="checkbox"]').trigger('click')
      expect(el.emitted('row:click')).toBeUndefined()
    })

    it('shows a hover affordance once rows respond to a click', () => {
      expect(clickable().find('tbody tr').classes()).toContain('hover:bg-accent')
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
