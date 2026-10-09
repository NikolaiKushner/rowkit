<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from 'rowkit'
import type { HomeUser } from '../home-users'
import { label } from './useLandingDemo'

/**
 * The pencil on a row of the landing page's live table: the row's fields in a
 * dialog, edited as a copy. Save writes it back into the table; Cancel, Escape
 * and ✕ drop it.
 */
const props = defineProps<{
  /** The row being edited; the dialog is open while there is one. */
  user: HomeUser | undefined
}>()

const emit = defineEmits<{
  save: [user: HomeUser]
  close: []
}>()

const roles = ['Owner', 'Admin', 'Member']
const statuses = Object.keys(label) as HomeUser['status'][]

const draft = reactive<HomeUser>({} as HomeUser)
const tried = ref(false)

watch(
  () => props.user,
  (user) => {
    if (!user) return
    Object.assign(draft, user)
    tried.value = false
  },
  { immediate: true }
)

const errors = computed(() =>
  tried.value
    ? {
        name: draft.name.trim() ? undefined : 'Enter a name.',
        email: /^[^@\s]+@[^@\s.]+\.\S+$/.test(draft.email)
          ? undefined
          : 'Enter a valid email address.',
      }
    : {}
)

function save(): void {
  tried.value = true
  if (errors.value.name ?? errors.value.email) return
  emit('save', { ...draft, seats: Number(draft.seats) })
}
</script>

<template>
  <Dialog :open="user !== undefined" @update:open="(open) => !open && emit('close')">
    <DialogContent close-label="Close Edit user">
      <form class="contents" novalidate @submit.prevent="save">
        <DialogHeader>
          <DialogTitle>Edit {{ user?.name }}</DialogTitle>
        </DialogHeader>
        <DialogBody class="flex flex-col gap-3">
          <Field label="Name" :error="errors.name" required>
            <Input v-model="draft.name" />
          </Field>
          <Field label="Email" :error="errors.email" required>
            <Input v-model="draft.email" type="email" />
          </Field>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Role">
              <Select v-model="draft.role">
                <SelectTrigger />
                <SelectContent>
                  <SelectItem v-for="role in roles" :key="role" :value="role" :label="role" />
                </SelectContent>
              </Select>
            </Field>
            <Field label="Status">
              <Select v-model="draft.status">
                <SelectTrigger />
                <SelectContent>
                  <SelectItem
                    v-for="status in statuses"
                    :key="status"
                    :value="status"
                    :label="label[status]"
                  />
                </SelectContent>
              </Select>
            </Field>
            <Field label="Seats">
              <Input v-model="draft.seats" type="number" />
            </Field>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="submit">Save</Button>
          <Button variant="secondary" @click="emit('close')">Cancel</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
