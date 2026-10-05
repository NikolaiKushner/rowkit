<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Button,
  DataTable,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DataTableColumn,
} from 'rowkit'

interface Person {
  id: number
  name: string
  team: string
}

const people: Person[] = [
  { id: 1, name: 'Ada Lovelace', team: 'Research' },
  { id: 2, name: 'Grace Hopper', team: 'Platform' },
  { id: 3, name: 'Alan Turing', team: 'Research' },
  { id: 4, name: 'Katherine Johnson', team: 'Finance' },
  { id: 5, name: 'Barbara Liskov', team: 'Platform' },
]

const columns: DataTableColumn<Person>[] = [
  { key: 'name', header: 'Name' },
  { key: 'team', header: 'Team' },
]

const open = ref(false)
const chosen = ref<number>()
const pending = ref<number[]>([])
const owner = computed(() => people.find((person) => person.id === chosen.value))

function begin(value: boolean): void {
  open.value = value
  if (value) pending.value = chosen.value === undefined ? [] : [chosen.value]
}

function confirm(): void {
  chosen.value = pending.value[0]
  open.value = false
}
</script>

<template>
  <div class="flex items-center gap-3 text-ui">
    <span>Owner: {{ owner?.name ?? 'nobody' }}</span>
    <Dialog :open="open" @update:open="begin">
      <DialogTrigger as-child>
        <Button variant="secondary" size="sm">Change…</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose an owner</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DataTable
            v-model:selected="pending"
            :rows="people"
            :columns="columns"
            caption="People"
            selectable="single"
            :row-label="(row) => row.name"
          />
        </DialogBody>
        <DialogFooter>
          <Button :disabled="pending.length === 0" @click="confirm">OK</Button>
          <Button variant="secondary" @click="open = false">Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
