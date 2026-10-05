<script setup lang="ts">
import { ref } from 'vue'
import { Button, useToast } from 'rowkit'

const { toast } = useToast()
const files = ref(['report-q3.pdf', 'logo.svg', 'users.csv'])

function remove(name: string): void {
  const index = files.value.indexOf(name)
  files.value = files.value.filter((file) => file !== name)
  // Act at once, offer the way back: longer than the default, so there is time to read it.
  toast(`Deleted ${name}`, {
    duration: 8000,
    action: {
      label: 'Undo',
      onClick: () => files.value.splice(index, 0, name),
    },
  })
}
</script>

<template>
  <ul class="m-0 flex list-none flex-col gap-1 p-0 text-ui">
    <li v-for="file in files" :key="file" class="flex w-56 items-center justify-between">
      {{ file }}
      <Button size="xs" variant="secondary" @click="remove(file)">Delete</Button>
    </li>
    <li v-if="files.length === 0" class="text-text-subtle">No files.</li>
  </ul>
</template>
