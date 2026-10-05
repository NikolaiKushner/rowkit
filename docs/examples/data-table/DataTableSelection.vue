<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, CopyIcon, DataTable, TrashIcon, type DataTableColumn } from 'rowkit'

interface File {
  id: number
  name: string
  type: string
  size: string
}

const columns: DataTableColumn<File>[] = [
  { key: 'name', header: 'Name' },
  { key: 'type', header: 'Type' },
  { key: 'size', header: 'Size', numeric: true },
]

const files = ref<File[]>([
  { id: 1, name: 'report-q3.pdf', type: 'PDF document', size: '1.2 MB' },
  { id: 2, name: 'logo.svg', type: 'SVG image', size: '4 KB' },
  { id: 3, name: 'users.csv', type: 'CSV file', size: '88 KB' },
  { id: 4, name: 'notes.txt', type: 'Text document', size: '2 KB' },
])

// Selected rows, by id. Always an array.
const selected = ref<number[]>([2])
const count = computed(() => selected.value.length)

function removeSelected(): void {
  files.value = files.value.filter((file) => !selected.value.includes(file.id))
  selected.value = []
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <div role="toolbar" aria-label="Files" class="flex items-center gap-1">
      <Button variant="ghost" :disabled="count === 0">
        <template #leading><CopyIcon /></template>
        Copy {{ count }}
      </Button>
      <Button variant="ghost" :disabled="count === 0" @click="removeSelected">
        <template #leading><TrashIcon /></template>
        Delete {{ count }}
      </Button>
    </div>
    <DataTable
      v-model:selected="selected"
      :rows="files"
      :columns="columns"
      caption="Files"
      selectable="multiple"
      :row-label="(row) => row.name"
    />
  </div>
</template>
