<script setup lang="ts">
import { ref } from 'vue'
import { Button, EmptyState, type EmptyStateReason } from 'rowkit'

const reason = ref<EmptyStateReason>('no-data')
const reasons: EmptyStateReason[] = ['no-data', 'no-results', 'error']

const copy = {
  'no-data': { title: 'No invoices yet', description: 'Invoices you send appear here.' },
  'no-results': { title: 'No invoices match «overdue»', description: undefined },
  error: { title: 'Invoices could not be loaded', description: undefined },
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div role="group" aria-label="Reason" class="flex flex-wrap gap-1">
      <Button
        v-for="value in reasons"
        :key="value"
        size="sm"
        variant="secondary"
        :pressed="reason === value"
        @click="reason = value"
      >
        {{ value }}
      </Button>
    </div>
    <!--
      The same layout, three different meanings: the icon, the default
      description and the action follow the reason. `announce` reads a change
      out — useful when a filter or a retry produced it.
    -->
    <EmptyState
      :key="reason"
      :reason="reason"
      :title="copy[reason].title"
      :description="copy[reason].description"
      :announce="reason !== 'no-data'"
      :level="3"
    >
      <template #actions>
        <Button v-if="reason === 'no-data'">New invoice</Button>
        <Button v-else-if="reason === 'no-results'" variant="secondary">Clear filters</Button>
        <Button v-else variant="secondary">Try again</Button>
      </template>
    </EmptyState>
  </div>
</template>
