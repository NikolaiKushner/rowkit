<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  DataTable,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  type DataTableColumn,
} from 'rowkit'

interface Ticket {
  id: number
  subject: string
  from: string
  opened: string
  body: string
}

const columns: DataTableColumn<Ticket>[] = [
  { key: 'subject', header: 'Subject' },
  { key: 'from', header: 'From' },
  { key: 'opened', header: 'Opened' },
  { id: 'open', header: 'Open', headerSrOnly: true },
]

const tickets: Ticket[] = [
  {
    id: 1,
    subject: 'Cannot export to CSV',
    from: 'Ada',
    opened: '09:12',
    body: 'The export button does nothing on Safari 17.',
  },
  {
    id: 2,
    subject: 'Invoice address',
    from: 'Grace',
    opened: '10:40',
    body: 'Please change the address on INV-1043.',
  },
  {
    id: 3,
    subject: 'Add a second owner',
    from: 'Alan',
    opened: '11:05',
    body: 'We need two owners on the Research team.',
  },
]

const open = ref<Ticket>()
</script>

<template>
  <!--
    A listener on row:click makes rows focusable and opens one on click,
    Enter or Space. The Open button is still there: a clickable row is an
    extra, never the only way in.
  -->
  <DataTable :rows="tickets" :columns="columns" caption="Tickets" @row:click="open = $event">
    <template #[`cell:open`]="{ row }">
      <Button size="xs" variant="secondary" @click.stop="open = row">Open</Button>
    </template>
  </DataTable>

  <Dialog :open="open !== undefined" @update:open="(value) => !value && (open = undefined)">
    <DialogContent v-if="open" class="w-[360px]">
      <DialogHeader>
        <DialogTitle>{{ open.subject }}</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <p class="m-0 text-ui">From {{ open.from }}, {{ open.opened }}</p>
        <p class="m-0 mt-2 text-ui">{{ open.body }}</p>
      </DialogBody>
      <DialogFooter>
        <Button @click="open = undefined">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
