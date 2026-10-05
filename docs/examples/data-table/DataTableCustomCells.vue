<script setup lang="ts">
import { ref } from 'vue'
import { Badge, Button, DataTable, EditIcon, TrashIcon, type DataTableColumn } from 'rowkit'

interface Invoice {
  id: number
  number: string
  customer: string
  email: string
  status: 'paid' | 'due' | 'overdue'
  amount: number
}

const columns: DataTableColumn<Invoice>[] = [
  { key: 'number', header: 'Invoice' },
  { key: 'customer', header: 'Customer' },
  { key: 'email', header: 'Email' },
  { key: 'status', header: 'Status' },
  { key: 'amount', header: 'Amount', numeric: true },
  // No field behind it: an `id` column, rendered from the `cell:actions` slot.
  { id: 'actions', header: 'Actions', headerSrOnly: true, width: '56px' },
]

const invoices = ref<Invoice[]>([
  {
    id: 1,
    number: 'INV-1042',
    customer: 'Lovelace Ltd',
    email: 'ada@example.com',
    status: 'paid',
    amount: 1280,
  },
  {
    id: 2,
    number: 'INV-1043',
    customer: 'Hopper & Co',
    email: 'grace@example.com',
    status: 'due',
    amount: 640.5,
  },
  {
    id: 3,
    number: 'INV-1044',
    customer: 'Turing Labs',
    email: 'alan@example.com',
    status: 'overdue',
    amount: 3120,
  },
])

const tone = { paid: 'success', due: 'warning', overdue: 'danger' } as const
const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' })

function remove(invoice: Invoice): void {
  invoices.value = invoices.value.filter((item) => item.id !== invoice.id)
}
</script>

<template>
  <DataTable :rows="invoices" :columns="columns" caption="Invoices">
    <!-- A link in a cell: one line, as a list view row is. -->
    <template #[`cell:email`]="{ row }">
      <a :href="`mailto:${row.email}`" class="text-link underline">{{ row.email }}</a>
    </template>

    <template #[`cell:status`]="{ row }">
      <Badge :variant="tone[row.status]" size="sm" dot>{{ row.status }}</Badge>
    </template>

    <!-- Format in the slot; the row keeps the raw number, so it still sorts as one. -->
    <template #[`cell:amount`]="{ row }">{{ money.format(row.amount) }}</template>

    <template #[`cell:actions`]="{ row }">
      <div class="flex">
        <Button variant="ghost" size="icon-xs" :aria-label="`Edit ${row.number}`">
          <EditIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          :aria-label="`Delete ${row.number}`"
          @click="remove(row)"
        >
          <TrashIcon />
        </Button>
      </div>
    </template>
  </DataTable>
</template>
