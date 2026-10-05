<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Badge,
  DataTable,
  Field,
  FilterBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  type DataTableColumn,
  type FilterChip,
} from 'rowkit'
import { people, type Person } from '../data-table/people'

type Status = Person['status']
type Role = Person['role']

const search = ref('')
const status = ref<Status>()
const role = ref<Role>()

const statuses: Status[] = ['active', 'invited', 'suspended']
const roles: Role[] = ['Owner', 'Admin', 'Member', 'Billing']

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return people.filter(
    (person) =>
      (term === '' || `${person.name} ${person.email}`.toLowerCase().includes(term)) &&
      (status.value === undefined || person.status === status.value) &&
      (role.value === undefined || person.role === role.value)
  )
})

const chips = computed<FilterChip[]>(() => [
  ...(search.value ? [{ id: 'search', label: 'Search', value: search.value }] : []),
  ...(status.value ? [{ id: 'status', label: 'Status', value: status.value }] : []),
  ...(role.value ? [{ id: 'role', label: 'Role', value: role.value }] : []),
])

function remove(id: string): void {
  if (id === 'search') search.value = ''
  if (id === 'status') status.value = undefined
  if (id === 'role') role.value = undefined
}

function clear(): void {
  search.value = ''
  status.value = undefined
  role.value = undefined
}

const columns: DataTableColumn<Person>[] = [
  { key: 'name', header: 'Name', width: '150px' },
  { key: 'email', header: 'Email', width: '240px' },
  { key: 'role', header: 'Role', width: '90px' },
  { key: 'status', header: 'Status', width: '100px' },
]
const tone = { active: 'success', invited: 'warning', suspended: 'danger' } as const
</script>

<template>
  <div class="flex flex-col gap-1">
    <FilterBar
      v-model:search="search"
      :filters="chips"
      :result-count="filtered.length"
      label="User filters"
      search-placeholder="Search name or email"
      @remove="remove"
      @clear="clear"
    >
      <!-- Each control keeps a name for screen readers, without a visible label. -->
      <template #controls>
        <Field label="Status" label-sr-only>
          <Select v-model="status">
            <SelectTrigger placeholder="Status" class="w-32" />
            <SelectContent>
              <SelectItem v-for="value in statuses" :key="value" :value="value" :label="value" />
            </SelectContent>
          </Select>
        </Field>
        <Field label="Role" label-sr-only>
          <Select v-model="role">
            <SelectTrigger placeholder="Role" class="w-32" />
            <SelectContent>
              <SelectItem v-for="value in roles" :key="value" :value="value" :label="value" />
            </SelectContent>
          </Select>
        </Field>
      </template>
      <template #summary="{ count }">{{ count }} users</template>
    </FilterBar>

    <DataTable
      :rows="filtered"
      :columns="columns"
      caption="Users"
      class="max-h-56"
      empty-reason="no-results"
      empty-title="No users match these filters"
    >
      <template #[`cell:status`]="{ row }">
        <Badge :variant="tone[row.status]" size="sm" dot>{{ row.status }}</Badge>
      </template>
    </DataTable>
  </div>
</template>
