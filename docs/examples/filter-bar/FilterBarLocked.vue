<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, CopyIcon, FilterBar, type FilterChip } from 'rowkit'

const search = ref('overdue')
const mine = ref(true)

const chips = computed<FilterChip[]>(() => [
  // Applied by the application, not by the person: shown, but not removable.
  { id: 'workspace', label: 'Workspace', value: 'Lovelace Ltd', removable: false },
  ...(mine.value ? [{ id: 'mine', label: 'Assigned to', value: 'me' }] : []),
  ...(search.value ? [{ id: 'search', label: 'Search', value: search.value }] : []),
])

function remove(id: string): void {
  if (id === 'mine') mine.value = false
  if (id === 'search') search.value = ''
}
</script>

<template>
  <FilterBar
    v-model:search="search"
    :filters="chips"
    :result-count="mine ? 4 : 17"
    label="Invoice filters"
    search-placeholder="Search invoices"
    @remove="remove"
    @clear="((mine = false), (search = ''))"
  >
    <!-- Actions on what the filters show sit at the end of the bar. -->
    <template #actions>
      <Button variant="ghost">
        <template #leading><CopyIcon /></template>
        Export
      </Button>
    </template>
    <template #summary="{ count }">{{ count }} invoices</template>
  </FilterBar>
</template>
