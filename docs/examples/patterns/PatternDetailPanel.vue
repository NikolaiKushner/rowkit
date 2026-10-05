<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge, Button, DataTable, EmptyState, GroupBox, type DataTableColumn } from 'rowkit'
import { people, type Person } from '../data-table/people'

const rows = people.slice(0, 10)
const selected = ref<number[]>([])
const person = computed(() => rows.find((row) => row.id === selected.value[0]))

const columns: DataTableColumn<Person>[] = [
  { key: 'name', header: 'Name', width: '10rem' },
  { key: 'team', header: 'Team' },
]
const tone = { active: 'success', invited: 'warning', suspended: 'danger' } as const
</script>

<template>
  <!--
    List and details side by side, stacked on a phone. A click or Enter opens a
    row; the radio column says which one is open and works from the keyboard.
  -->
  <div class="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_16rem]">
    <DataTable
      v-model:selected="selected"
      :rows="rows"
      :columns="columns"
      caption="People"
      selectable="single"
      :row-label="(row) => row.name"
      class="max-h-64"
      @row:click="(row) => (selected = [row.id])"
    />
    <GroupBox legend="Details" as="section">
      <dl v-if="person" class="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-ui">
        <dt class="text-text-subtle">Name</dt>
        <dd class="m-0 font-bold">{{ person.name }}</dd>
        <dt class="text-text-subtle">Email</dt>
        <dd class="m-0 truncate">{{ person.email }}</dd>
        <dt class="text-text-subtle">Role</dt>
        <dd class="m-0">{{ person.role }}</dd>
        <dt class="text-text-subtle">Status</dt>
        <dd class="m-0">
          <Badge :variant="tone[person.status]" size="sm" dot>{{ person.status }}</Badge>
        </dd>
        <dt class="text-text-subtle">Joined</dt>
        <dd class="m-0">{{ person.joined }}</dd>
      </dl>
      <EmptyState
        v-else
        size="sm"
        title="Nobody selected"
        description="Pick a person to see their details."
        :level="3"
      />
      <Button v-if="person" size="sm" variant="secondary" class="mt-3 self-start">Edit…</Button>
    </GroupBox>
  </div>
</template>
