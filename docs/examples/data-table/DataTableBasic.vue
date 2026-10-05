<script setup lang="ts">
import { DataTable, type DataTableColumn } from 'rowkit'

interface Member {
  id: number
  name: string
  role: string
  seats: number
}

const columns: DataTableColumn<Member>[] = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'seats', header: 'Seats', numeric: true },
]

const members: Member[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Owner', seats: 3 },
  { id: 2, name: 'Grace Hopper', role: 'Admin', seats: 12 },
  { id: 3, name: 'Alan Turing', role: 'Member', seats: 1 },
  { id: 4, name: 'Katherine Johnson', role: 'Member', seats: 0 },
]
</script>

<template>
  <DataTable :rows="members" :columns="columns" caption="Team members" />
</template>
