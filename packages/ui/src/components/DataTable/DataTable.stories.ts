import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, type ConcreteComponent } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import Badge from '../Badge/Badge.vue'
import Button from '../Button/Button.vue'
import RawDataTable from './DataTable.vue'
import { useClientSort } from '../../composables/useClientSort'
import type { DataTableColumn, DataTableSort } from './types'

/** A generic SFC does not satisfy the `Component` index signature of a `components` map. */
const DataTable = RawDataTable as unknown as ConcreteComponent

const sizes = ['sm', 'md'] as const

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'invited' | 'suspended'
  seats: number
}

const users: User[] = [
  {
    id: 1,
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    role: 'Owner',
    status: 'active',
    seats: 3,
  },
  {
    id: 2,
    name: 'Grace Hopper',
    email: 'grace@example.com',
    role: 'Admin',
    status: 'active',
    seats: 12,
  },
  {
    id: 3,
    name: 'Alan Turing',
    email: 'alan@example.com',
    role: 'Member',
    status: 'invited',
    seats: 1,
  },
  {
    id: 4,
    name: 'Katherine Johnson',
    email: 'katherine@example.com',
    role: 'Member',
    status: 'suspended',
    seats: 0,
  },
]

const columns: DataTableColumn<User>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
  { key: 'seats', header: 'Seats', align: 'end' },
]

/**
 * Controls declared explicitly rather than inferred, so the docs table shows
 * the public API instead of Vue's internal slot machinery.
 */
interface DataTableArgs {
  caption: string
  captionVisible: boolean
  loading: boolean
  loadingRows: number
  size: (typeof sizes)[number]
  hoverable: boolean
  emptyTitle: string
}

const meta: Meta<DataTableArgs> = {
  title: 'Data/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  args: {
    caption: 'Team members',
    captionVisible: false,
    loading: false,
    loadingRows: 5,
    size: 'md',
    hoverable: false,
    emptyTitle: 'Nothing to show',
  },
  argTypes: {
    caption: { control: 'text' },
    captionVisible: { control: 'boolean' },
    loading: { control: 'boolean' },
    loadingRows: { control: { type: 'number', min: 1, max: 10 } },
    size: { control: 'inline-radio', options: sizes },
    hoverable: { control: 'boolean' },
    emptyTitle: { control: 'text' },
  },
  render: (args) => ({
    components: { DataTable },
    setup: () => ({ args, users, columns }),
    template: `
      <div class="w-full max-w-3xl">
        <DataTable v-bind="args" :rows="users" :columns="columns" />
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<DataTableArgs>

export const Default: Story = {}

/** The caption is the table's accessible name. Showing it is a design choice. */
export const VisibleCaption: Story = {
  args: { captionVisible: true },
}

export const Compact: Story = {
  args: { size: 'sm' },
}

/** Turn hover on only when the row does something — otherwise it implies a click. */
export const Hoverable: Story = {
  args: { hoverable: true },
}

/** Placeholder rows matched to the real ones, so the layout does not jump. */
export const Loading: Story = {
  args: { loading: true },
}

export const Empty: Story = {
  render: (args) => ({
    components: { DataTable },
    setup: () => ({ args, columns }),
    template: `
      <div class="w-full max-w-3xl">
        <DataTable
          v-bind="args"
          :rows="[]"
          :columns="columns"
         
          empty-title="No team members"
          empty-description="Invite someone to get started."
        />
      </div>
    `,
  }),
}

/**
 * The per-column slot is what makes a table readable: twelve columns defined,
 * markup written only for the two that need it.
 */
export const CustomCells: Story = {
  render: () => ({
    components: { DataTable, Badge, Button },
    setup: () => ({
      users,
      // Named, but hidden. An empty `<th>` leaves the column unannounced.
      columns: [...columns, { id: 'actions', header: 'Actions', headerSrOnly: true, align: 'end' }],
      tone: (status: User['status']) =>
        status === 'active' ? 'success' : status === 'invited' ? 'warning' : 'danger',
    }),
    template: `
      <div class="w-full max-w-3xl">
        <DataTable :rows="users" :columns="columns" caption="Team members">
          <template #[\`cell:status\`]="{ value }">
            <Badge :variant="tone(value)" dot>{{ value }}</Badge>
          </template>
          <template #[\`cell:actions\`]="{ row }">
            <Button variant="ghost" size="sm" :aria-label="'Edit ' + row.name">Edit</Button>
          </template>
        </DataTable>
      </div>
    `,
  }),
}

/**
 * A column with no field behind it, rendered entirely from a slot. `key` stays
 * constrained to the row's own fields; `id` is how you opt out of that.
 */
export const ComputedColumn: Story = {
  render: () => ({
    components: { DataTable },
    setup: () => ({
      users,
      columns: [
        { key: 'name', header: 'Name' },
        { key: 'seats', header: 'Seats', align: 'end' },
        { id: 'cost', header: 'Monthly', align: 'end' },
      ],
    }),
    template: `
      <div class="w-full max-w-2xl">
        <DataTable :rows="users" :columns="columns" caption="Billing">
          <template #[\`cell:cost\`]="{ row }">
            \${{ row.seats * 12 }}
          </template>
        </DataTable>
      </div>
    `,
  }),
}

/**
 * Scroll this sideways. The name column stays put and grows a shadow once
 * there is anything hidden behind it — without that, a user scrolled to the
 * right cannot tell which row they are reading.
 */
export const StickyColumn: Story = {
  render: () => ({
    components: { DataTable },
    setup: () => ({
      users,
      columns: [
        { key: 'name', header: 'Name', sticky: true, width: '12rem' },
        { key: 'email', header: 'Email', width: '16rem' },
        { key: 'role', header: 'Role', width: '10rem' },
        { key: 'status', header: 'Status', width: '10rem' },
        { key: 'seats', header: 'Seats', align: 'end', width: '10rem' },
        { id: 'notes', header: 'Notes', width: '20rem' },
      ],
    }),
    template: `
      <div class="w-full max-w-md">
        <DataTable :rows="users" :columns="columns" caption="Team members">
          <template #[\`cell:notes\`]>Scroll sideways to see the pinned column.</template>
        </DataTable>
      </div>
    `,
  }),
}

/** The header stays visible while the body scrolls under it. */
export const StickyHeader: Story = {
  render: () => ({
    components: { DataTable },
    setup: () => ({
      rows: Array.from({ length: 40 }, (_, i) => ({
        id: i + 1,
        name: `Person ${String(i + 1)}`,
        email: `person${String(i + 1)}@example.com`,
        role: i % 3 === 0 ? 'Admin' : 'Member',
        status: 'active',
        seats: i % 7,
      })),
      columns,
    }),
    // The height goes on the component's own scroll container, not an outer
    // div — `position: sticky` resolves against the nearest scrolling ancestor.
    template: `
      <div class="w-full max-w-3xl">
        <DataTable
          :rows="rows"
          :columns="columns"
         
          caption="Team members"
          class="max-h-80"
        />
      </div>
    `,
  }),
}

const sortableColumns: DataTableColumn<User>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'seats', header: 'Seats', sortable: true, align: 'end' },
]

/** Sorting handled locally. Fine for a table that holds all its rows. */
function clientSorted() {
  return {
    components: { DataTable },
    setup: () => {
      const sort = ref<DataTableSort<User>>()
      return { rows: useClientSort(users, sort, sortableColumns), columns: sortableColumns, sort }
    },
    template: `
      <div class="w-full max-w-3xl">
        <DataTable :rows="rows" :columns="columns" caption="Team members" v-model:sort="sort" />
      </div>
    `,
  }
}

/**
 * Click a header to sort. The cycle is ascending, descending, then back to the
 * order the rows arrived in.
 */
export const Sortable: Story = {
  render: clientSorted,
}

/**
 * `manual` is the default: the table reports the sort and touches nothing.
 * This is the mode to use whenever the server orders and pages the data —
 * sorting locally would only reorder the page you can see.
 */
export const ManualSorting: Story = {
  render: () => ({
    components: { DataTable },
    setup: () => ({ users, columns: sortableColumns, sort: ref(undefined) }),
    template: `
      <div class="flex w-full max-w-3xl flex-col gap-3">
        <p class="text-sm text-text-muted">
          Emitted sort: <code>{{ sort ? sort.id + ' ' + sort.direction : 'none' }}</code>
          — the rows below never move.
        </p>
        <DataTable
          :rows="users"
          :columns="columns"
         
          caption="Team members"
          v-model:sort="sort"
        />
      </div>
    `,
  }),
}

/**
 * `sortValue` when the displayed text sorts badly. Status here has a meaningful
 * order — active, invited, suspended — that alphabetical sorting destroys.
 */
export const CustomSortValue: Story = {
  render: () => ({
    components: { DataTable },
    setup: () => {
      const statusColumns: DataTableColumn<User>[] = [
        { key: 'name', header: 'Name', sortable: true },
        {
          key: 'status',
          header: 'Status',
          sortable: true,
          sortValue: (row) => ({ active: 0, invited: 1, suspended: 2 })[row.status],
        },
      ]
      const sort = ref<DataTableSort<User>>({ key: 'status', direction: 'asc' })
      return { sort, rows: useClientSort(users, sort, statusColumns), columns: statusColumns }
    },
    template: `
      <div class="w-full max-w-2xl">
        <DataTable :rows="rows" :columns="columns" caption="Team members" v-model:sort="sort" />
      </div>
    `,
  }),
}

/** The full cycle, and the aria-sort state at each step. */
export const SortingCycle: Story = {
  render: clientSorted,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const header = () => canvas.getByRole('columnheader', { name: 'Name' })
    const firstCell = () => canvas.getAllByRole('row')[1]?.querySelector('td')

    await expect(header()).toHaveAttribute('aria-sort', 'none')

    await userEvent.click(canvas.getByRole('button', { name: 'Name' }))
    await expect(header()).toHaveAttribute('aria-sort', 'ascending')
    await expect(firstCell()).toHaveTextContent('Ada Lovelace')

    await userEvent.click(canvas.getByRole('button', { name: 'Name' }))
    await expect(header()).toHaveAttribute('aria-sort', 'descending')
    await expect(firstCell()).toHaveTextContent('Katherine Johnson')

    // Third click returns to the original order, not back to ascending.
    await userEvent.click(canvas.getByRole('button', { name: 'Name' }))
    await expect(header()).toHaveAttribute('aria-sort', 'none')
    await expect(firstCell()).toHaveTextContent('Ada Lovelace')
  },
}

/** Numbers compare numerically — 12 after 3, not before it. */
export const NumericSorting: Story = {
  render: clientSorted,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Seats' }))

    const seats = canvas
      .getAllByRole('row')
      .slice(1)
      .map((row) => row.querySelectorAll('td')[3]?.textContent?.trim())
    await expect(seats).toEqual(['0', '1', '3', '12'])
  },
}

/** Only one column is ever sorted, and the header is operable by keyboard. */
export const SortingIsKeyboardOperable: Story = {
  render: clientSorted,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const button = canvas.getByRole('button', { name: 'Role' })
    button.focus()
    await userEvent.keyboard('{Enter}')

    await expect(canvas.getByRole('columnheader', { name: 'Role' })).toHaveAttribute(
      'aria-sort',
      'ascending'
    )
    // Exactly one sorted column, whatever else is sortable.
    const sorted = canvas
      .getAllByRole('columnheader')
      .filter((h) => ['ascending', 'descending'].includes(h.getAttribute('aria-sort') ?? ''))
    await expect(sorted).toHaveLength(1)
  },
}

/** Checkboxes, a select-all, and a count of what is picked. */
function selectable(mode: 'single' | 'multiple') {
  return {
    components: { DataTable },
    setup: () => ({ users, columns, mode, selected: ref<(string | number)[]>([]) }),
    template: `
      <div class="flex w-full max-w-3xl flex-col gap-3">
        <p class="text-sm text-text-muted">Selected: {{ selected.length }}</p>
        <DataTable
          :rows="users"
          :columns="columns"
         
          caption="Team members"
          :selectable="mode"
          :row-label="(row) => 'Select ' + row.name"
          v-model:selected="selected"
        />
      </div>
    `,
  }
}

export const SelectableRows: Story = {
  render: () => selectable('multiple'),
}

/** Radios, and no select-all — there is nothing to select all of. */
export const SingleSelection: Story = {
  render: () => selectable('single'),
}

/** Selection and sorting together: the selection follows the row, not the position. */
export const SelectionWithSorting: Story = {
  render: () => ({
    components: { DataTable },
    setup: () => ({
      users,
      columns: sortableColumns,
      selected: ref<(string | number)[]>([3]),
      sort: ref({ key: 'name', direction: 'asc' }),
    }),
    template: `
      <div class="w-full max-w-3xl">
        <DataTable
          :rows="users"
          :columns="columns"
         
          caption="Team members"
          selectable="multiple"
          sort-mode="client"
          :row-label="(row) => 'Select ' + row.name"
          v-model:selected="selected"
          v-model:sort="sort"
        />
      </div>
    `,
  }),
}

/** The select-all cycles through unchecked, indeterminate and checked. */
export const SelectAllIsTriState: Story = {
  render: () => selectable('multiple'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const all = () => canvas.getByRole('checkbox', { name: 'Select all rows' })

    await expect(all()).toHaveAttribute('data-state', 'unchecked')

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select Ada Lovelace' }))
    await expect(all()).toHaveAttribute('data-state', 'indeterminate')

    await userEvent.click(all())
    await expect(all()).toHaveAttribute('data-state', 'checked')
    await expect(canvas.getByText('Selected: 4')).toBeInTheDocument()

    // Checked means the next click clears.
    await userEvent.click(all())
    await expect(canvas.getByText('Selected: 0')).toBeInTheDocument()
  },
}

/** Picking a second row replaces the first in single mode. */
export const SingleSelectionReplaces: Story = {
  render: () => selectable('single'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('radio', { name: 'Select Ada Lovelace' }))
    await expect(canvas.getByText('Selected: 1')).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('radio', { name: 'Select Grace Hopper' }))
    await expect(canvas.getByText('Selected: 1')).toBeInTheDocument()
    await expect(canvas.getByRole('radio', { name: 'Select Grace Hopper' })).toBeChecked()
    await expect(canvas.getByRole('radio', { name: 'Select Ada Lovelace' })).not.toBeChecked()
  },
}

/** Every control names its own row rather than its position. */
export const SelectionIsLabelled: Story = {
  render: () => selectable('multiple'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // A column of "Select row 3" is nearly useless read out of context.
    for (const user of users) {
      await expect(
        canvas.getByRole('checkbox', { name: `Select ${user.name}` })
      ).toBeInTheDocument()
    }
  },
}

/** The accessible contract: a named table with scoped column headers. */
export const Accessibility: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The caption names the table even though it is visually hidden.
    await expect(canvas.getByRole('table', { name: 'Team members' })).toBeInTheDocument()

    const headers = canvas.getAllByRole('columnheader')
    await expect(headers).toHaveLength(5)
    await expect(headers[0]).toHaveAttribute('scope', 'col')

    await expect(canvas.getAllByRole('row')).toHaveLength(users.length + 1)
  },
}

/** Loading announces once for the whole table rather than once per cell. */
export const LoadingIsAnnouncedOnce: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const status = canvas.getByRole('status')
    await expect(status).toHaveTextContent('Loading')

    // The placeholder bars themselves stay silent.
    await expect(canvas.queryAllByRole('status')).toHaveLength(1)
  },
}

/**
 * The benchmark. **Measures rendering, not sorting** — the rows are pre-sorted
 * and the table is handed them ready to paint, which is exactly what the table
 * does in production since it never sorts its own data.
 *
 * `useClientSort` carries its own timing, in its tests. Keeping the two apart
 * stops either cost hiding behind the other.
 *
 * Numbers and the virtualization decision live in
 * `docs/decisions/004-datatable-performance.md`.
 */
export const TenThousandRows: Story = {
  // The a11y scan is off here alone. axe walks every node, and 10,000 rows of
  // identical markup takes minutes to tell us what Default already asserts.
  parameters: { a11y: { test: 'off' } },
  render: () => ({
    components: { DataTable },
    setup: () => ({
      rows: Array.from({ length: 10_000 }, (_, i) => ({
        id: i + 1,
        name: `Person ${String(i + 1).padStart(5, '0')}`,
        email: `person${String(i + 1)}@example.com`,
        role: i % 3 === 0 ? 'Admin' : 'Member',
        status: 'active' as const,
        seats: i % 24,
      })),
      columns,
    }),
    template: `
      <div class="w-full max-w-3xl">
        <DataTable :rows="rows" :columns="columns" caption="Ten thousand people" class="max-h-96" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Every row is really in the DOM — there is no virtualization, deliberately.
    // Timings are measured out-of-band with Playwright; see decision 004.
    await expect(canvas.getAllByRole('row')).toHaveLength(10_001)
  },
}
