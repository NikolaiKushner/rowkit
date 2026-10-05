<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  Button,
  Checkbox,
  Field,
  GroupBox,
  Input,
  Window,
  WindowBody,
  WindowButton,
  WindowTitleBar,
} from 'rowkit'

const saved = reactive({ name: 'report-q3.pdf', readOnly: false, hidden: false })
const form = reactive({ ...saved })
const status = ref('')

function apply(): void {
  Object.assign(saved, form)
  status.value = 'Applied.'
}
</script>

<template>
  <!-- A Windows 98 properties sheet: groups of settings, and OK · Cancel · Apply. -->
  <Window class="w-full max-w-80">
    <WindowTitleBar title="report-q3.pdf Properties">
      <template #controls>
        <WindowButton glyph="close" label="Close" />
      </template>
    </WindowTitleBar>
    <WindowBody class="flex flex-col gap-3 p-3">
      <Field label="Name" layout="left" class="[--rk-field-label-width:3.5rem]">
        <Input v-model="form.name" />
      </Field>
      <GroupBox legend="Attributes">
        <Checkbox v-model="form.readOnly" label="Read-only" />
        <Checkbox v-model="form.hidden" label="Hidden" />
      </GroupBox>
      <div class="flex items-center justify-end gap-1.5">
        <span class="mr-auto text-ui" role="status">{{ status }}</span>
        <Button @click="apply">OK</Button>
        <Button variant="secondary" @click="Object.assign(form, saved)">Cancel</Button>
        <Button variant="secondary" @click="apply">Apply</Button>
      </div>
    </WindowBody>
  </Window>
</template>
