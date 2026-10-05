<script setup lang="ts">
import { ref } from 'vue'
import { Button, Checkbox, GroupBox } from 'rowkit'

const columns = ref({ name: true, email: true, role: false })
const sent = ref('')

// A native form: checked boxes submit their name and value, unchecked ones nothing.
function submit(event: Event): void {
  const data = new FormData(event.target as HTMLFormElement)
  sent.value = JSON.stringify(data.getAll('export'))
}
</script>

<template>
  <form class="flex flex-wrap items-end gap-3" @submit.prevent="submit">
    <GroupBox legend="Export columns" class="w-56">
      <Checkbox v-model="columns.name" name="export" value="name" label="Name" />
      <Checkbox v-model="columns.email" name="export" value="email" label="Email" />
      <Checkbox v-model="columns.role" name="export" value="role" label="Role" />
    </GroupBox>
    <div class="flex flex-col gap-1">
      <Button type="submit">Export</Button>
      <code v-if="sent" class="text-ui">{{ sent }}</code>
    </div>
  </form>
</template>
