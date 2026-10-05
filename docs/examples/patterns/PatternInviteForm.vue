<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Button, Field, Input, Select, SelectContent, SelectItem, SelectTrigger } from 'rowkit'

type Role = 'owner' | 'admin' | 'member'
const roles: { label: string; value: Role }[] = [
  { label: 'Owner', value: 'owner' },
  { label: 'Admin', value: 'admin' },
  { label: 'Member', value: 'member' },
]

const form = reactive<{ name: string; email: string; role?: Role; seats: number }>({
  name: '',
  email: '',
  role: undefined,
  seats: 1,
})
const touched = reactive({ name: false, email: false, role: false, seats: false })
const submitted = ref(false)
const saving = ref(false)
const saved = ref(false)

const errors = computed(() => ({
  name: form.name.trim() ? undefined : 'Enter a name.',
  email: /^[^@\s]+@[^@\s.]+\.\S+$/.test(form.email) ? undefined : 'Enter a valid email address.',
  role: form.role ? undefined : 'Choose a role.',
  seats: Number(form.seats) >= 1 ? undefined : 'At least one seat.',
}))

type Key = keyof typeof touched
// Shown once the person has left the field, or tried to submit — never mid-first-keystroke.
const shown = (key: Key) => (touched[key] || submitted.value ? errors.value[key] : undefined)
const valid = computed(() => Object.values(errors.value).every((message) => message === undefined))

function submit(): void {
  submitted.value = true
  saved.value = false
  if (!valid.value) return
  saving.value = true
  setTimeout(() => {
    saving.value = false
    saved.value = true
  }, 900)
}
</script>

<template>
  <!-- novalidate: this form renders its own messages, so the browser's bubbles stay off. -->
  <form class="flex w-full max-w-md flex-col gap-4" novalidate @submit.prevent="submit">
    <Field label="Full name" :error="shown('name')" required>
      <Input v-model="form.name" @blur="touched.name = true" />
    </Field>
    <Field
      label="Work email"
      hint="Used for the invitation and for billing receipts."
      :error="shown('email')"
      required
    >
      <Input
        v-model="form.email"
        type="email"
        placeholder="ada@example.com"
        @blur="touched.email = true"
      />
    </Field>
    <Field label="Role" hint="Determines what they can change." :error="shown('role')" required>
      <Select v-model="form.role">
        <SelectTrigger placeholder="Choose a role" />
        <SelectContent>
          <SelectItem
            v-for="option in roles"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          />
        </SelectContent>
      </Select>
    </Field>
    <Field label="Seats" :error="shown('seats')" required>
      <Input v-model="form.seats" type="number" @blur="touched.seats = true" />
    </Field>
    <div class="flex items-center gap-3">
      <!-- Never disabled while invalid: pressing it is how every error shows at once. -->
      <Button type="submit" :loading="saving">Send invitation</Button>
      <span v-if="saved" role="status" class="text-ui">Invitation sent.</span>
    </div>
  </form>
</template>
