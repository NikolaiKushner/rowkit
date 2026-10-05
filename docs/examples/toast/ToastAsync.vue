<script setup lang="ts">
import { ref } from 'vue'
import { Button, useToast } from 'rowkit'

const { success, danger } = useToast()
const saving = ref(false)
let attempt = 0

// Stands in for a request that fails the first time.
async function request(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 700))
  attempt++
  if (attempt % 2 === 1) throw new Error('Network error')
}

async function save(): Promise<void> {
  saving.value = true
  try {
    await request()
    success('Settings saved')
  } catch {
    // duration 0: a toast with a Retry waits for the person — it never times out.
    danger('Settings could not be saved', {
      title: 'Network error',
      duration: 0,
      action: { label: 'Retry', onClick: () => void save() },
    })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Button :loading="saving" @click="save">Save settings</Button>
</template>
