<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Field, Input } from 'rowkit'

const taken = ['ada', 'grace', 'alan', 'admin', 'root']

/** Stands in for GET /usernames/:name — answers after a moment. */
async function isAvailable(name: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return !taken.includes(name.toLowerCase())
}

const username = ref('')
const checking = ref(false)
const available = ref<boolean>()
let timer: ReturnType<typeof setTimeout> | undefined
let request = 0

// Local rules answer at once; the server is asked only for a well-formed name, after a pause.
const formatError = computed(() => {
  if (username.value === '') return undefined
  if (!/^[a-z0-9-]{3,20}$/i.test(username.value)) return 'Use 3–20 letters, digits or hyphens.'
  return undefined
})

watch(username, (value) => {
  clearTimeout(timer)
  available.value = undefined
  if (value === '' || formatError.value) return
  checking.value = true
  timer = setTimeout(() => void check(value), 400)
})

async function check(value: string): Promise<void> {
  const id = ++request
  const result = await isAvailable(value)
  if (id !== request) return // the name changed while we asked
  available.value = result
  checking.value = false
}
onBeforeUnmount(() => clearTimeout(timer))

const error = computed(
  () =>
    formatError.value ?? (available.value === false ? `«${username.value}» is taken.` : undefined)
)
const hint = computed(() => {
  if (checking.value) return 'Checking…'
  if (available.value) return `«${username.value}» is available.`
  return 'Your address will be rowkit.dev/@name. Try «ada».'
})
</script>

<template>
  <Field label="Username" :hint="hint" :error="error" class="w-full max-w-xs">
    <Input v-model="username" autocomplete="username" />
  </Field>
</template>
