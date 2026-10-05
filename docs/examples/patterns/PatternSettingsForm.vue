<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Button, Checkbox, Field, GroupBox, Input } from 'rowkit'

interface Settings {
  company: string
  replyTo: string
  weeklyDigest: boolean
  mentions: boolean
}

// What the server has, and the copy being edited.
const saved = reactive<Settings>({
  company: 'Lovelace Ltd',
  replyTo: 'billing@lovelace.example',
  weeklyDigest: true,
  mentions: false,
})
const form = reactive<Settings>({ ...saved })
const saving = ref(false)
const message = ref('')

const dirty = computed(() =>
  (Object.keys(saved) as (keyof Settings)[]).some((key) => form[key] !== saved[key])
)

function revert(): void {
  Object.assign(form, saved)
  message.value = ''
}

function save(): void {
  saving.value = true
  setTimeout(() => {
    Object.assign(saved, form)
    saving.value = false
    message.value = 'Settings saved.'
  }, 700)
}
</script>

<template>
  <!--
    Editing what already exists: Save and Revert matter only once something
    changed, and the bar says so — nothing is lost by navigating unaware.
  -->
  <form class="flex w-full max-w-md flex-col gap-3" @submit.prevent="save">
    <GroupBox legend="Company" class="[--rk-field-label-width:5rem]">
      <Field layout="left" label="Name"><Input v-model="form.company" /></Field>
      <Field layout="left" label="Reply-to"><Input v-model="form.replyTo" type="email" /></Field>
    </GroupBox>
    <GroupBox legend="Email me">
      <Checkbox v-model="form.weeklyDigest" label="A weekly digest" />
      <Checkbox v-model="form.mentions" label="When someone mentions me" />
    </GroupBox>
    <div class="flex items-center justify-end gap-1.5 text-ui">
      <span class="mr-auto" role="status">{{ dirty ? 'Unsaved changes' : message }}</span>
      <Button type="submit" :disabled="!dirty" :loading="saving">Save</Button>
      <Button variant="secondary" :disabled="!dirty || saving" @click="revert">Revert</Button>
    </div>
  </form>
</template>
