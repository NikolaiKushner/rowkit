import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref, type ConcreteComponent } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import RawSelect from '../Select/Select.vue'
import FilterBar from './FilterBar.vue'
import type { FilterChip } from './types'

/**
 * `Select` is generic, and a generic SFC does not satisfy the plain `Component`
 * index signature that a `components` map is checked against.
 */
const Select = RawSelect as unknown as ConcreteComponent

const sizes = ['sm', 'md'] as const

/**
 * Controls declared explicitly rather than inferred, so the docs table shows
 * the public API instead of Vue's internal slot machinery.
 */
interface FilterBarArgs {
  searchable: boolean
  size: (typeof sizes)[number]
  disabled: boolean
  resultCount?: number
}

const applied: FilterChip[] = [
  { id: 'role', label: 'Role', value: 'Admin' },
  { id: 'status', label: 'Status', value: 'Active' },
  { id: 'team', label: 'Team', value: 'Platform' },
]

/** Stateful wrapper — the bar displays applied filters, the app owns them. */
function stateful(args: Partial<FilterBarArgs>, initial: FilterChip[] = applied) {
  return {
    components: { FilterBar },
    setup: () => {
      const filters = ref([...initial])
      const search = ref('')
      const remove = (id: string) => {
        filters.value = filters.value.filter((f) => f.id !== id)
      }
      const clear = () => {
        filters.value = []
      }
      const resultCount = computed(() => 247 - filters.value.length * 60)
      return { args, filters, search, remove, clear, resultCount }
    },
    template: `
      <div class="w-full max-w-3xl">
        <FilterBar
          v-bind="args"
          v-model:search="search"
          :filters="filters"
          :result-count="resultCount"
          @remove="remove"
          @clear="clear"
        />
      </div>
    `,
  }
}

const meta: Meta<FilterBarArgs> = {
  title: 'Data/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  args: {
    searchable: true,
    size: 'md',
    disabled: false,
  },
  argTypes: {
    searchable: { control: 'boolean' },
    size: { control: 'inline-radio', options: sizes },
    disabled: { control: 'boolean' },
    resultCount: { control: 'number' },
  },
  render: (args) => stateful(args),
}

export default meta
type Story = StoryObj<FilterBarArgs>

export const Default: Story = {}

/** Nothing applied yet — no chip row, no clear control, just the search box. */
export const NoFiltersApplied: Story = {
  render: (args) => stateful(args, []),
}

/** The filter controls themselves go in the `controls` slot. */
export const WithControls: Story = {
  render: () => ({
    components: { FilterBar, Select },
    setup: () => {
      const filters = ref([...applied])
      const search = ref('')
      const role = ref<string>()
      const roles = [
        { label: 'Owner', value: 'owner' },
        { label: 'Admin', value: 'admin' },
        { label: 'Member', value: 'member' },
      ]
      return {
        filters,
        search,
        role,
        roles,
        remove: (id: string) => {
          filters.value = filters.value.filter((f) => f.id !== id)
        },
        clear: () => {
          filters.value = []
        },
      }
    },
    template: `
      <div class="w-full max-w-3xl">
        <FilterBar
          v-model:search="search"
          :filters="filters"
          :result-count="67"
          @remove="remove"
          @clear="clear"
        >
          <template #controls>
            <Select v-model="role" :options="roles" placeholder="Role" size="md" class="w-40" />
          </template>
        </FilterBar>
      </div>
    `,
  }),
}

/**
 * A filter the application applied itself — a tenant scope, say — has no remove
 * control, because the user is not permitted to clear it.
 */
export const NonRemovableFilter: Story = {
  render: (args) =>
    stateful(args, [
      { id: 'tenant', label: 'Workspace', value: 'Acme', removable: false },
      { id: 'role', label: 'Role', value: 'Admin' },
    ]),
}

/** Long values truncate rather than pushing the row off the edge. */
export const LongValues: Story = {
  render: (args) =>
    stateful(args, [
      { id: 'q', label: 'Search', value: 'customers who signed up before the pricing change' },
      { id: 'role', label: 'Role', value: 'Admin' },
    ]),
}

export const Compact: Story = {
  args: { size: 'sm' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

/** Removing a chip emits its id; the application decides what that means. */
export const RemovingAFilter: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Role: Admin')).toBeInTheDocument()

    await userEvent.click(canvas.getByLabelText('Remove Role: Admin filter'))

    await expect(canvas.queryByText('Role: Admin')).toBeNull()
    await expect(canvas.getByText('Status: Active')).toBeInTheDocument()
  },
}

/**
 * The behaviour that makes repeated removal usable: focus lands on the chip
 * that took the removed one's place, so a keyboard user can clear several in a
 * row without tabbing back in each time.
 */
export const FocusMovesToTheNextChip: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByLabelText('Remove Role: Admin filter'))

    await expect(canvas.getByLabelText('Remove Status: Active filter')).toHaveFocus()

    // And again, without touching the keyboard in between.
    await userEvent.click(document.activeElement as HTMLElement)
    await expect(canvas.getByLabelText('Remove Team: Platform filter')).toHaveFocus()
  },
}

/** With no chips left, focus falls back to the search box. */
export const FocusFallsBackToSearch: Story = {
  render: (args) => stateful(args, [{ id: 'role', label: 'Role', value: 'Admin' }]),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByLabelText('Remove Role: Admin filter'))

    await expect(canvas.getByRole('searchbox')).toHaveFocus()
  },
}

export const ClearingEverything: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Clear all' }))

    await expect(canvas.queryByText('Role: Admin')).toBeNull()
    await expect(canvas.queryByRole('button', { name: 'Clear all' })).toBeNull()
    await expect(canvas.getByRole('searchbox')).toHaveFocus()
  },
}

/**
 * The result count is a live region, so filtering announces its effect. It is
 * silent on first render — live regions report changes, not initial content.
 */
export const ResultCountAnnounces: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const status = canvas.getByRole('status')
    await expect(status).toHaveTextContent('67 results')

    await userEvent.click(canvas.getByLabelText('Remove Role: Admin filter'))

    await expect(status).toHaveTextContent('127 results')
  },
}

/** The region is a named landmark, reachable without tabbing through controls. */
export const Accessibility: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('search', { name: 'Filters' })).toBeInTheDocument()

    // Every chip names the filter it clears, not just "Remove".
    await expect(canvas.getByLabelText('Remove Team: Platform filter')).toBeInTheDocument()
  },
}
