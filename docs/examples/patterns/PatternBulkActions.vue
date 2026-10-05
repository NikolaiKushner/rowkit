<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Button,
  DataTable,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  TrashIcon,
  Warning32Icon,
  type DataTableColumn,
} from 'rowkit'
import { people, type Person } from '../data-table/people'

const rows = ref<Person[]>(people.slice(0, 8))
const selected = ref<number[]>([])
const confirming = ref(false)
// The list before the last delete, kept so it can be undone.
const before = ref<Person[]>()
const deleted = ref(0)

const count = computed(() => selected.value.length)
const columns: DataTableColumn<Person>[] = [
  { key: 'name', header: 'Name', width: '11rem' },
  { key: 'team', header: 'Team', width: '7rem' },
  { key: 'role', header: 'Role' },
]

function remove(): void {
  before.value = rows.value
  deleted.value = count.value
  rows.value = rows.value.filter((row) => !selected.value.includes(row.id))
  selected.value = []
  confirming.value = false
}

function undo(): void {
  if (before.value) rows.value = before.value
  before.value = undefined
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <!-- The toolbar speaks about the selection: how many, and what can be done to them. -->
    <div
      role="toolbar"
      aria-label="Selection"
      class="flex min-h-[27px] flex-wrap items-center gap-2 text-ui"
    >
      <template v-if="count">
        <span>{{ count }} selected</span>
        <Button variant="ghost" size="sm" @click="confirming = true">
          <template #leading><TrashIcon /></template>
          Delete…
        </Button>
        <Button variant="link" @click="selected = []">Clear selection</Button>
      </template>
      <span v-else-if="before" role="status">
        Deleted {{ deleted }}.
        <Button variant="link" @click="undo">Undo</Button>
      </span>
      <span v-else class="text-text-subtle">Select people to act on them.</span>
    </div>

    <DataTable
      v-model:selected="selected"
      :rows="rows"
      :columns="columns"
      caption="People"
      selectable="multiple"
      :row-label="(row) => row.name"
    />

    <Dialog v-model:open="confirming">
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Delete {{ count }} {{ count === 1 ? 'person' : 'people' }}?</DialogTitle>
        </DialogHeader>
        <DialogBody class="flex items-start gap-3">
          <Warning32Icon class="shrink-0" />
          <DialogDescription
            >They lose access at once. You can undo this straight after.</DialogDescription
          >
        </DialogBody>
        <DialogFooter>
          <Button @click="confirming = false">Cancel</Button>
          <Button variant="destructive" @click="remove">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
