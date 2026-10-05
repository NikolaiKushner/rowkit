<script setup lang="ts">
import { computed, ref } from 'vue'
import { Field, Input } from 'rowkit'

const email = ref('ada@')
// Show the error once the person has left the field, not on the first keystroke.
const touched = ref(false)

const error = computed(() => {
  if (!touched.value) return undefined
  if (email.value.trim() === '') return 'Enter your work email.'
  if (!/^[^@\s]+@[^@\s.]+\.\S+$/.test(email.value)) return 'Enter a valid email address.'
  return undefined
})
</script>

<template>
  <!--
    The hint stays while the error shows: both are read out, so fixing the
    mistake never costs the guidance that would have prevented it.
  -->
  <Field
    label="Work email"
    hint="Used for billing receipts."
    :error="error"
    required
    class="max-w-80"
  >
    <Input v-model="email" type="email" placeholder="ada@example.com" @blur="touched = true" />
  </Field>
</template>
