<script setup lang="ts">
import { computed } from 'vue'
import { DataTable, type DataTableColumn } from 'rowkit'

interface Line {
  id: number
  item: string
  quantity: number
  price: number
}

const columns: DataTableColumn<Line>[] = [
  { key: 'item', header: 'Item' },
  { key: 'quantity', header: 'Qty', numeric: true },
  { key: 'price', header: 'Unit price', numeric: true },
  // A computed column: no field, so it has an `id` and a slot.
  { id: 'total', header: 'Total', numeric: true },
]

const lines: Line[] = [
  { id: 1, item: 'Seats, Team plan', quantity: 12, price: 49 },
  { id: 2, item: 'Extra storage, 100 GB', quantity: 2, price: 15 },
  { id: 3, item: 'Priority support', quantity: 1, price: 120 },
]

const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' })

// Keyed like the columns. Values show as given, so format them here.
const summary = computed(() => ({
  item: 'Total',
  quantity: lines.reduce((sum, line) => sum + line.quantity, 0),
  total: money.format(lines.reduce((sum, line) => sum + line.quantity * line.price, 0)),
}))
</script>

<template>
  <DataTable :rows="lines" :columns="columns" caption="Order" :summary="summary">
    <template #[`cell:price`]="{ row }">{{ money.format(row.price) }}</template>
    <template #[`cell:total`]="{ row }">{{ money.format(row.quantity * row.price) }}</template>
  </DataTable>
</template>
