<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, DataTable, EmptyState, type DataTableColumn } from 'rowkit'

interface Order {
  id: number
  number: string
  customer: string
  total: string
}

type State = 'rows' | 'loading' | 'no-data' | 'no-results' | 'error'

const columns: DataTableColumn<Order>[] = [
  // Widths keep the header still on a first load, before there are rows to measure.
  { key: 'number', header: 'Order', width: '110px' },
  { key: 'customer', header: 'Customer', width: '180px' },
  { key: 'total', header: 'Total', numeric: true, width: '100px' },
]

const orders: Order[] = [
  { id: 1, number: '#4021', customer: 'Lovelace Ltd', total: '€1,280.00' },
  { id: 2, number: '#4022', customer: 'Hopper & Co', total: '€640.50' },
  { id: 3, number: '#4023', customer: 'Turing Labs', total: '€3,120.00' },
]

const states: State[] = ['rows', 'loading', 'no-data', 'no-results', 'error']
const state = ref<State>('rows')
const rows = computed(() => (state.value === 'rows' ? orders : []))
</script>

<template>
  <div class="flex flex-col gap-2">
    <div role="group" aria-label="State" class="flex flex-wrap gap-1">
      <Button
        v-for="value in states"
        :key="value"
        size="sm"
        variant="secondary"
        :pressed="state === value"
        @click="state = value"
      >
        {{ value }}
      </Button>
    </div>

    <!-- No data yet: the built-in empty state, with your own words. -->
    <DataTable
      v-if="state !== 'no-results' && state !== 'error'"
      :rows="rows"
      :columns="columns"
      caption="Orders"
      :loading="state === 'loading'"
      :loading-rows="3"
      empty-title="No orders yet"
      empty-description="Orders appear here as soon as a customer checks out."
    />

    <!-- Filters matched nothing, or the fetch failed: your own empty state, with a way out. -->
    <DataTable v-else :rows="[]" :columns="columns" caption="Orders">
      <template #empty>
        <EmptyState
          v-if="state === 'no-results'"
          reason="no-results"
          size="sm"
          :level="3"
          title="No orders match «Hopper»"
          description="Check the spelling or clear the search."
        >
          <template #actions>
            <Button size="sm" @click="state = 'rows'">Clear search</Button>
          </template>
        </EmptyState>
        <EmptyState
          v-else
          reason="error"
          size="sm"
          :level="3"
          title="Orders could not be loaded"
          description="The server did not answer. Your data is safe."
        >
          <template #actions>
            <Button size="sm" @click="state = 'loading'">Try again</Button>
          </template>
        </EmptyState>
      </template>
    </DataTable>
  </div>
</template>
