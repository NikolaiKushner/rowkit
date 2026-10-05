<script setup lang="ts">
import { computed, ref } from 'vue'
import { DataTable, GroupBox, type DataTableColumn } from 'rowkit'

interface Plan {
  id: string
  name: string
  seats: number
  price: string
  includes: string
}

const columns: DataTableColumn<Plan>[] = [
  { key: 'name', header: 'Plan' },
  { key: 'seats', header: 'Seats', numeric: true },
  { key: 'price', header: 'Per month', numeric: true },
]

const plans: Plan[] = [
  { id: 'free', name: 'Free', seats: 3, price: '€0', includes: 'Community support.' },
  { id: 'team', name: 'Team', seats: 25, price: '€49', includes: 'Email support and audit log.' },
  {
    id: 'business',
    name: 'Business',
    seats: 250,
    price: '€299',
    includes: 'SSO, SLA and a named contact.',
  },
]

// Single selection still uses an array — it holds at most one id.
const selected = ref<string[]>(['team'])
const plan = computed(() => plans.find((item) => item.id === selected.value[0]))
</script>

<template>
  <div class="flex flex-wrap items-start gap-3">
    <DataTable
      v-model:selected="selected"
      :rows="plans"
      :columns="columns"
      caption="Plans"
      selectable="single"
      :row-label="(row) => row.name"
      class="w-auto"
    />
    <GroupBox legend="Details" class="min-w-48 flex-1">
      <p v-if="plan" class="m-0 text-ui">
        <b>{{ plan.name }}</b> — up to {{ plan.seats }} seats. {{ plan.includes }}
      </p>
      <p v-else class="m-0 text-ui text-text-subtle">Choose a plan.</p>
    </GroupBox>
  </div>
</template>
