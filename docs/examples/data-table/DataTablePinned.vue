<script setup lang="ts">
import { ref } from 'vue'
import { DataTable, type DataTableColumn } from 'rowkit'
import { people, type Person } from './people'

// Wider than the frame: the pinned columns stay put while the rest scroll.
const columns: DataTableColumn<Person>[] = [
  { key: 'id', header: 'ID', numeric: true, sticky: true, width: '48px' },
  { key: 'name', header: 'Name', sticky: true, width: '150px' },
  { key: 'email', header: 'Email', width: '260px' },
  { key: 'role', header: 'Role', width: '100px' },
  { key: 'team', header: 'Team', width: '120px' },
  { key: 'status', header: 'Status', width: '100px' },
  { key: 'seats', header: 'Seats', numeric: true, width: '80px' },
  { key: 'joined', header: 'Joined', width: '110px' },
]

const selected = ref<number[]>([])
</script>

<template>
  <!-- A height bounds the table; the body scrolls under the sticky header. -->
  <DataTable
    v-model:selected="selected"
    :rows="people"
    :columns="columns"
    caption="People"
    selectable="multiple"
    :row-label="(row) => row.name"
    class="max-h-64"
  />
</template>
