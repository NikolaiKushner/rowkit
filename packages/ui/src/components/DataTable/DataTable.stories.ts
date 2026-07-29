import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ConcreteComponent } from 'vue'
import { expect, within } from 'storybook/test'
import Badge from '../Badge/Badge.vue'
import Button from '../Button/Button.vue'
import RawDataTable from './DataTable.vue'
import type { DataTableColumn } from './types'

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
        <DataTable v-bind="args" :rows="users" :columns="columns" row-key="id" />
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
          row-key="id"
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
        <DataTable :rows="users" :columns="columns" row-key="id" caption="Team members">
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
        <DataTable :rows="users" :columns="columns" row-key="id" caption="Billing">
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
        <DataTable :rows="users" :columns="columns" row-key="id" caption="Team members">
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
          row-key="id"
          caption="Team members"
          class="max-h-80"
        />
      </div>
    `,
  }),
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
