<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from 'rowkit'

interface Member {
  name: string
  email: string
  role: 'Admin' | 'Member'
}

const member = ref<Member>({ name: 'Grace Hopper', email: 'grace@example.com', role: 'Member' })
const open = ref(false)
// Edit a copy: Cancel throws it away, Save puts it back.
const draft = reactive<Member>({ ...member.value })
const tried = ref(false)
const nameError = computed(() => (tried.value && !draft.name.trim() ? 'Enter a name.' : undefined))

function start(value: boolean): void {
  open.value = value
  if (value) {
    Object.assign(draft, member.value)
    tried.value = false
  }
}

function save(): void {
  tried.value = true
  if (nameError.value) return
  member.value = { ...draft }
  open.value = false
}
</script>

<template>
  <div class="flex items-center gap-3 text-ui">
    <span>{{ member.name }} · {{ member.email }} · {{ member.role }}</span>
    <Dialog :open="open" @update:open="start">
      <DialogTrigger as-child>
        <Button variant="secondary" size="sm">Edit…</Button>
      </DialogTrigger>
      <DialogContent>
        <!-- A real form: Enter in any field saves, through the submit button. -->
        <form class="contents" @submit.prevent="save">
          <DialogHeader>
            <DialogTitle>Edit member</DialogTitle>
          </DialogHeader>
          <DialogBody class="flex flex-col gap-3">
            <Field label="Name" :error="nameError" required>
              <Input v-model="draft.name" />
            </Field>
            <Field label="Email">
              <Input v-model="draft.email" type="email" />
            </Field>
            <Field label="Role">
              <Select v-model="draft.role">
                <SelectTrigger />
                <SelectContent>
                  <SelectItem value="Admin" label="Admin" />
                  <SelectItem value="Member" label="Member" />
                </SelectContent>
              </Select>
            </Field>
          </DialogBody>
          <DialogFooter>
            <Button type="submit">Save</Button>
            <Button variant="secondary" @click="open = false">Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
