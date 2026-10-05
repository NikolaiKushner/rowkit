<script setup lang="ts">
import { ref } from 'vue'
import { Button, Field, Input } from 'rowkit'

const name = ref('')
const sent = ref('')

function submit(): void {
  sent.value = name.value
}
</script>

<template>
  <!--
    Buttons default to type="button", so nothing submits a form by accident.
    The submit button says type="submit"; Reset clears the native form.
  -->
  <form class="flex max-w-80 flex-col gap-3" @submit.prevent="submit">
    <Field label="Project name">
      <Input v-model="name" required />
    </Field>
    <div class="flex justify-end gap-1.5">
      <Button type="submit">Create</Button>
      <Button type="reset" variant="secondary" @click="name = ''">Reset</Button>
    </div>
    <p v-if="sent" class="m-0 text-ui" role="status">Created «{{ sent }}».</p>
  </form>
</template>
