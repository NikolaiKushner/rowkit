<script setup lang="ts">
import { ref } from 'vue'
import { Button, CopyIcon } from 'rowkit'

const saving = ref(false)
const exporting = ref(false)

// Stands in for a request.
const wait = () => new Promise((resolve) => setTimeout(resolve, 1500))

async function save(): Promise<void> {
  saving.value = true
  await wait()
  saving.value = false
}

async function exportCsv(): Promise<void> {
  exporting.value = true
  await wait()
  exporting.value = false
}
</script>

<template>
  <!--
    While loading, the hourglass takes the leading slot and clicks do nothing,
    but the button keeps focus and its place in the tab order.
  -->
  <div class="flex flex-wrap items-center gap-2">
    <Button :loading="saving" loading-label="Saving" @click="save">Save changes</Button>
    <!-- With a leading icon the hourglass swaps in place: the width never changes. -->
    <Button variant="secondary" :loading="exporting" @click="exportCsv">
      <template #leading><CopyIcon /></template>
      Export CSV
    </Button>
  </div>
</template>
