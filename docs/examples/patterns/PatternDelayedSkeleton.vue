<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { Badge, Button, DataTable, type DataTableColumn } from 'rowkit'

interface Member {
  id: number
  name: string
  role: string
  status: 'active' | 'invited'
  seats: number
}

const columns: DataTableColumn<Member>[] = [
  { key: 'name', header: 'Name', width: '11rem' },
  { key: 'role', header: 'Role', width: '7rem' },
  { key: 'status', header: 'Status', width: '7rem' },
  { key: 'seats', header: 'Seats', numeric: true, width: '5rem' },
]
const members: Member[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Owner', status: 'active', seats: 3 },
  { id: 2, name: 'Grace Hopper', role: 'Admin', status: 'active', seats: 12 },
  { id: 3, name: 'Alan Turing', role: 'Member', status: 'invited', seats: 1 },
]
const tone = { active: 'success', invited: 'warning' } as const

const rows = ref<Member[]>(members)
// `pending` flips at once; `showSkeleton` only after 150ms, so a fast answer never flashes.
const pending = ref(false)
const showSkeleton = ref(false)
let delay: ReturnType<typeof setTimeout> | undefined
let done: ReturnType<typeof setTimeout> | undefined

function load(duration: number): void {
  clearTimeout(delay)
  clearTimeout(done)
  pending.value = true
  rows.value = []
  delay = setTimeout(() => (showSkeleton.value = pending.value), 150)
  // Stands in for the request.
  done = setTimeout(() => {
    pending.value = showSkeleton.value = false
    rows.value = members
  }, duration)
}

onBeforeUnmount(() => {
  clearTimeout(delay)
  clearTimeout(done)
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-wrap gap-2">
      <Button size="sm" variant="secondary" @click="load(80)">Fast response (80ms)</Button>
      <Button size="sm" variant="secondary" @click="load(1800)">Slow response (1800ms)</Button>
    </div>
    <DataTable
      :rows="rows"
      :columns="columns"
      caption="Team members"
      :loading="showSkeleton"
      :loading-rows="3"
      loading-label="Loading team members"
    >
      <template #[`cell:status`]="{ row }">
        <Badge :variant="tone[row.status]" size="sm" dot>{{ row.status }}</Badge>
      </template>
    </DataTable>
    <p class="m-0 text-ui text-text-subtle">
      {{
        pending
          ? showSkeleton
            ? 'Loading — placeholders shown'
            : 'Loading — under the delay, nothing shown'
          : 'Idle'
      }}
    </p>
  </div>
</template>
