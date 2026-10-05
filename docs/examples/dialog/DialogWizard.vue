<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  GroupBox,
  Input,
  Radio,
} from 'rowkit'

const open = ref(false)
const step = ref(1)
const template = ref('blank')
const name = ref('')
const created = ref('')

const templates = [
  { value: 'blank', label: 'Blank workspace' },
  { value: 'crm', label: 'Customer list' },
  { value: 'tasks', label: 'Task tracker' },
]
const templateLabel = computed(() => templates.find((t) => t.value === template.value)?.label)

function reset(value: boolean): void {
  open.value = value
  if (value) {
    step.value = 1
    name.value = ''
  }
}

function finish(): void {
  created.value = name.value
  open.value = false
}
</script>

<template>
  <div class="flex items-center gap-3">
    <Dialog :open="open" @update:open="reset">
      <DialogTrigger as-child>
        <Button>New workspace…</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New workspace — step {{ step }} of 3</DialogTitle>
        </DialogHeader>
        <DialogBody class="min-h-36">
          <GroupBox v-if="step === 1" legend="Start from">
            <Radio
              v-for="item in templates"
              :key="item.value"
              v-model="template"
              name="wizard-template"
              :value="item.value"
              :label="item.label"
            />
          </GroupBox>
          <Field v-else-if="step === 2" label="Workspace name" hint="You can change it later.">
            <Input v-model="name" placeholder="Apollo" />
          </Field>
          <DialogDescription v-else>
            Ready to create «{{ name }}» from «{{ templateLabel }}». Press Finish.
          </DialogDescription>
        </DialogBody>
        <!-- Windows 98 wizard buttons: < Back, Next >, then Cancel. -->
        <DialogFooter>
          <Button variant="secondary" :disabled="step === 1" @click="step--">&lt; Back</Button>
          <Button v-if="step < 3" :disabled="step === 2 && !name.trim()" @click="step++">
            Next &gt;
          </Button>
          <Button v-else @click="finish">Finish</Button>
          <Button variant="secondary" @click="open = false">Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <span v-if="created" role="status" class="text-ui">Created «{{ created }}».</span>
  </div>
</template>
