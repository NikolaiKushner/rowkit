<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { Button, Field, Input } from 'rowkit'

const form = reactive({ email: 'grace@example.com', company: '', vat: 'GB123' })
const errors = ref<Partial<Record<keyof typeof form, string>>>({})
const saving = ref(false)
const root = ref<HTMLFormElement>()

/** Stands in for POST /accounts, which answers 422 with a message per field. */
async function createAccount(): Promise<Partial<Record<keyof typeof form, string>>> {
  await new Promise((resolve) => setTimeout(resolve, 700))
  const problems: Partial<Record<keyof typeof form, string>> = {}
  if (form.email === 'grace@example.com')
    problems.email = 'An account with this email already exists.'
  if (!form.company.trim()) problems.company = 'Enter your company name.'
  if (!/^GB\d{9}$/.test(form.vat)) problems.vat = 'A UK VAT number is GB and nine digits.'
  return problems
}

async function submit(): Promise<void> {
  saving.value = true
  errors.value = await createAccount()
  saving.value = false
  // Several fields failed: take the person to the first, not to the top of the page.
  await nextTick()
  root.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
}
</script>

<template>
  <!-- The server's answer goes straight onto the fields: `error` takes any string. -->
  <form ref="root" novalidate class="flex w-full max-w-md flex-col gap-3" @submit.prevent="submit">
    <Field label="Email" :error="errors.email">
      <Input v-model="form.email" type="email" @input="errors.email = undefined" />
    </Field>
    <Field label="Company" :error="errors.company">
      <Input v-model="form.company" @input="errors.company = undefined" />
    </Field>
    <Field label="VAT number" hint="Optional for individuals." :error="errors.vat">
      <Input v-model="form.vat" @input="errors.vat = undefined" />
    </Field>
    <div class="flex items-center gap-3">
      <Button type="submit" :loading="saving">Create account</Button>
      <span v-if="!saving && Object.keys(errors).length === 0" class="text-ui text-text-subtle">
        Press it to see the server's answer.
      </span>
    </div>
  </form>
</template>
