<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import { Button, Field, Input } from 'rowkit'

const form = reactive({ name: '', email: '', password: '' })
const submitted = ref(false)
const done = ref(false)
const root = ref<HTMLFormElement>()

// Errors appear after the first submit and then follow the typing.
const errors = computed(() => {
  if (!submitted.value) return {}
  return {
    name: form.name.trim() ? undefined : 'Enter your name.',
    email: /^[^@\s]+@[^@\s.]+\.\S+$/.test(form.email) ? undefined : 'Enter a valid email address.',
    password: form.password.length >= 10 ? undefined : 'Use at least 10 characters.',
  }
})

async function submit(): Promise<void> {
  submitted.value = true
  if (Object.values(errors.value).some(Boolean)) {
    // Take the person to the first problem.
    await nextTick()
    root.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }
  done.value = true
}
</script>

<template>
  <form ref="root" novalidate class="flex max-w-80 flex-col gap-3" @submit.prevent="submit">
    <Field label="Name" :error="errors.name" required>
      <Input v-model="form.name" autocomplete="name" />
    </Field>
    <Field label="Email" :error="errors.email" required>
      <Input v-model="form.email" type="email" autocomplete="email" />
    </Field>
    <Field label="Password" hint="At least 10 characters." :error="errors.password" required>
      <Input v-model="form.password" type="password" autocomplete="new-password" />
    </Field>
    <div class="flex items-center justify-end gap-2">
      <span v-if="done" role="status" class="text-ui">Account created.</span>
      <Button type="submit">Create account</Button>
    </div>
  </form>
</template>
