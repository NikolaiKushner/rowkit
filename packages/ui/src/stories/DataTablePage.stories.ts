import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref, type ConcreteComponent } from 'vue'
import Badge from '../components/Badge/Badge.vue'
import Button from '../components/Button/Button.vue'
import RawDataTable from '../components/DataTable/DataTable.vue'
import EmptyState from '../components/EmptyState/EmptyState.vue'
import FilterBar from '../components/FilterBar/FilterBar.vue'
import Pagination from '../components/Pagination/Pagination.vue'
import RawSelect from '../components/Select/Select.vue'
import RawSelectItem from '../components/Select/SelectItem.vue'
import SelectContent from '../components/Select/SelectContent.vue'
import SelectTrigger from '../components/Select/SelectTrigger.vue'
import Tooltip from '../components/Tooltip/Tooltip.vue'
import TooltipContent from '../components/Tooltip/TooltipContent.vue'
import TooltipTrigger from '../components/Tooltip/TooltipTrigger.vue'
import type { DataTableColumn, DataTableSort } from '../components/DataTable/types'
import type { FilterChip } from '../components/FilterBar/types'
import {
  demoRoleOptions,
  demoStatusOptions,
  demoStatusTone,
  demoUsers,
  type DemoUser,
} from './demo-users'

const DataTable = RawDataTable as unknown as ConcreteComponent
const Select = RawSelect as unknown as ConcreteComponent
const SelectItem = RawSelectItem as unknown as ConcreteComponent

const columns: DataTableColumn<DemoUser>[] = [
  { key: 'name', header: 'Name', sortable: true, sticky: true, width: '12rem' },
  { key: 'email', header: 'Email', sortable: true, width: '16rem' },
  { key: 'role', header: 'Role', sortable: true, width: '8rem' },
  { key: 'status', header: 'Status', sortable: true, width: '9rem' },
  { key: 'seats', header: 'Seats', sortable: true, align: 'end', width: '6rem' },
  { key: 'lastActive', header: 'Last active', sortable: true, width: '9rem' },
  { id: 'actions', header: 'Actions', headerSrOnly: true, align: 'end', width: '5rem' },
]

/**
 * The money shot: FilterBar + DataTable + Pagination as one composition.
 *
 * Portfolio and docs reviewers judge this frame, not a lone Button. Keep it
 * product-shaped — badges, muted secondary cells, seeded filters, bulk bar.
 */
const meta: Meta = {
  title: 'Patterns/DataTablePage',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'The composed users-admin page. This is the surface rowkit is for — not twelve isolated controls.',
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => ({
    components: {
      Badge,
      Button,
      DataTable,
      EmptyState,
      FilterBar,
      Pagination,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      Tooltip,
      TooltipContent,
      TooltipTrigger,
    },
    setup: () => {
      const search = ref('')
      const role = ref<string | undefined>('Admin')
      const status = ref<string | undefined>()
      const sort = ref<DataTableSort<DemoUser>>({ key: 'name', direction: 'asc' })
      const page = ref(1)
      const pageSize = ref(5)
      const selected = ref<PropertyKey[]>([2])

      const filtered = computed(() => {
        const term = search.value.trim().toLowerCase()
        return demoUsers.filter((user) => {
          if (role.value !== undefined && user.role !== role.value) return false
          if (status.value !== undefined && user.status !== status.value) return false
          if (term === '') return true
          return user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
        })
      })

      const sorted = computed(() => {
        const active = sort.value
        if (active === undefined) return filtered.value
        const key = active.key
        return [...filtered.value].sort((a, b) => {
          const av = a[key]
          const bv = b[key]
          if (av === bv) return 0
          const cmp = av < bv ? -1 : 1
          return active.direction === 'asc' ? cmp : -cmp
        })
      })

      const pageRows = computed(() =>
        sorted.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
      )

      const chips = computed<FilterChip[]>(() => {
        const applied: FilterChip[] = []
        if (search.value.trim() !== '') {
          applied.push({ id: 'search', label: 'Search', value: search.value })
        }
        if (role.value !== undefined) {
          applied.push({ id: 'role', label: 'Role', value: role.value })
        }
        if (status.value !== undefined) {
          const label = demoStatusOptions.find((o) => o.value === status.value)?.label
          applied.push({ id: 'status', label: 'Status', value: label ?? status.value })
        }
        return applied
      })

      function removeFilter(id: string) {
        if (id === 'search') search.value = ''
        if (id === 'role') role.value = undefined
        if (id === 'status') status.value = undefined
      }

      function clearFilters() {
        search.value = ''
        role.value = undefined
        status.value = undefined
      }

      return {
        search,
        role,
        status,
        sort,
        page,
        pageSize,
        selected,
        columns,
        pageRows,
        filtered,
        chips,
        demoRoleOptions,
        demoStatusOptions,
        demoStatusTone,
        removeFilter,
        clearFilters,
        rowAction:
          'opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 focus-visible:opacity-100',
      }
    },
    template: `
      <div class="flex w-full max-w-5xl flex-col gap-4">
        <header class="flex flex-wrap items-end justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">Workspace</p>
            <h1 class="mt-1 text-2xl font-medium tracking-tight text-foreground">Users</h1>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ filtered.length }} people with access to this workspace.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <Button variant="outline">Export</Button>
            <Button>Invite teammate</Button>
          </div>
        </header>

        <div class="flex flex-col gap-2">
          <FilterBar
            v-model:search="search"
            label="User filters"
            search-placeholder="Search name or email…"
            :filters="chips"
            :result-count="filtered.length"
            @remove="removeFilter"
            @clear="clearFilters"
          >
            <template #controls>
              <Select v-model="role">
                <SelectTrigger placeholder="Role" class="w-36" />
                <SelectContent>
                  <SelectItem v-for="option in demoRoleOptions" :key="option.value" :value="option.value" :label="option.label" />
                </SelectContent>
              </Select>
              <Select v-model="status">
                <SelectTrigger placeholder="Status" class="w-36" />
                <SelectContent>
                  <SelectItem v-for="option in demoStatusOptions" :key="option.value" :value="option.value" :label="option.label" />
                </SelectContent>
              </Select>
            </template>
          </FilterBar>

          <div
            v-if="selected.length > 0"
            class="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-muted px-3 py-1.5"
          >
            <p class="text-sm font-medium text-foreground">
              {{ selected.length }} selected
            </p>
            <div class="flex items-center gap-2">
              <Button variant="ghost" size="sm" @click="selected = []">Clear</Button>
              <Button variant="destructive" size="sm">Suspend</Button>
            </div>
          </div>
        </div>

        <DataTable
          v-model:sort="sort"
          v-model:selected="selected"
          :rows="pageRows"
          :columns="columns"
          caption="Users"
          selectable="multiple"
          :row-label="(row) => 'Select ' + row.name"
          hoverable
        >
          <template #[\`cell:name\`]="{ row }">
            <span class="font-medium text-foreground">{{ row.name }}</span>
          </template>
          <template #[\`cell:email\`]="{ row }">
            <Tooltip>
              <TooltipTrigger as-child>
                <span class="block max-w-[14rem] truncate text-muted-foreground">{{ row.email }}</span>
              </TooltipTrigger>
              <TooltipContent>{{ row.email }}</TooltipContent>
            </Tooltip>
          </template>
          <template #[\`cell:status\`]="{ row }">
            <Badge :variant="demoStatusTone[row.status]" size="sm" dot>{{ row.status }}</Badge>
          </template>
          <template #[\`cell:seats\`]="{ value }">
            <span class="tabular-nums">{{ value }}</span>
          </template>
          <template #[\`cell:lastActive\`]="{ value }">
            <span class="tabular-nums text-muted-foreground">{{ value }}</span>
          </template>
          <template #[\`cell:actions\`]="{ row }">
            <Button
              variant="ghost"
              size="sm"
              :class="rowAction"
              :aria-label="'Edit ' + row.name"
            >Edit</Button>
          </template>
          <template #empty>
            <EmptyState
              size="sm"
              announce
              reason="no-results"
              title="No users match those filters"
              description="Try a different search, or widen the role and status filters."
            >
              <template #actions>
                <Button variant="ghost" size="sm" @click="clearFilters">Clear filters</Button>
              </template>
            </EmptyState>
          </template>
        </DataTable>

        <Pagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :total="filtered.length"
          :page-size-options="[5, 10, 25]"
          label="Users pagination"
        />
      </div>
    `,
  }),
}
