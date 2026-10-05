<script setup lang="ts">
import { computed, ref } from 'vue'
import { Checkbox, GroupBox } from 'rowkit'

const reports = ref([
  { id: 'sales', label: 'Sales by region', on: true },
  { id: 'churn', label: 'Churn by plan', on: false },
  { id: 'usage', label: 'Usage by team', on: true },
  { id: 'billing', label: 'Failed payments', on: false },
])

const all = computed(() => reports.value.every((report) => report.on))
const some = computed(() => !all.value && reports.value.some((report) => report.on))

function setAll(value: boolean): void {
  for (const report of reports.value) report.on = value
}
</script>

<template>
  <GroupBox legend="Send these reports" class="w-64">
    <!-- Checked when all are, indeterminate when some are; clicking sets every one. -->
    <Checkbox
      :model-value="all"
      :indeterminate="some"
      label="All reports"
      @update:model-value="setAll"
    />
    <div class="flex flex-col gap-2 pl-5">
      <Checkbox
        v-for="report in reports"
        :key="report.id"
        v-model="report.on"
        :label="report.label"
      />
    </div>
  </GroupBox>
</template>
