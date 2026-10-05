<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  DataTable,
  PlusIcon,
  Separator,
  StatusBar,
  StatusBarSection,
  TrashIcon,
  Window,
  WindowBody,
  WindowButton,
  WindowTitleBar,
  type DataTableColumn,
} from 'rowkit'

interface Contact {
  id: number
  name: string
  phone: string
}

const columns: DataTableColumn<Contact>[] = [
  { key: 'name', header: 'Name' },
  { key: 'phone', header: 'Phone' },
]
const contacts = ref<Contact[]>([
  { id: 1, name: 'Ada Lovelace', phone: '+44 20 7946 0001' },
  { id: 2, name: 'Grace Hopper', phone: '+1 202 555 0102' },
  { id: 3, name: 'Alan Turing', phone: '+44 161 496 0003' },
])
const selected = ref<number[]>([])
let next = 4

function add(): void {
  contacts.value = [...contacts.value, { id: next, name: `New contact ${next}`, phone: '' }]
  next++
}

function remove(): void {
  contacts.value = contacts.value.filter((contact) => !selected.value.includes(contact.id))
  selected.value = []
}
</script>

<template>
  <!-- A small application: title bar, toolbar, a list, and a status bar. -->
  <Window class="h-72 w-full max-w-[480px]">
    <WindowTitleBar title="Contacts">
      <template #controls>
        <WindowButton glyph="minimize" label="Minimize" />
        <WindowButton glyph="maximize" label="Maximize" />
        <WindowButton glyph="close" label="Close" />
      </template>
    </WindowTitleBar>
    <div role="toolbar" aria-label="Contacts" class="flex items-center gap-1 p-0.5">
      <Button variant="ghost" @click="add">
        <template #leading><PlusIcon /></template>
        New
      </Button>
      <Separator orientation="vertical" decorative class="h-[23px]" />
      <Button variant="ghost" :disabled="selected.length === 0" @click="remove">
        <template #leading><TrashIcon /></template>
        Delete
      </Button>
    </div>
    <WindowBody class="flex min-h-0 flex-col px-0.5">
      <DataTable
        v-model:selected="selected"
        :rows="contacts"
        :columns="columns"
        caption="Contacts"
        selectable="multiple"
        :row-label="(row) => row.name"
        class="min-h-0 flex-1"
      />
    </WindowBody>
    <StatusBar>
      <StatusBarSection>{{ contacts.length }} contacts</StatusBarSection>
      <StatusBarSection class="w-24">{{ selected.length }} selected</StatusBarSection>
    </StatusBar>
  </Window>
</template>
