<script setup lang="ts">
import { ref, watch } from 'vue'
import { Field, Select, SelectContent, SelectItem, SelectTrigger } from 'rowkit'

interface User {
  id: number
  name: string
  email: string
}

const directory: User[] = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' },
  { id: 2, name: 'Grace Hopper', email: 'grace@example.com' },
  { id: 3, name: 'Alan Turing', email: 'alan@example.com' },
  { id: 4, name: 'Katherine Johnson', email: 'katherine@example.com' },
  { id: 5, name: 'Barbara Liskov', email: 'barbara@example.com' },
  { id: 6, name: 'Edsger Dijkstra', email: 'edsger@example.com' },
]

/** Stands in for GET /users?q=… — it matches the email too, which the label does not show. */
async function searchUsers(term: string): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const q = term.trim().toLowerCase()
  return directory.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(q))
}

const assignee = ref<number>()
const term = ref('')
const results = ref<User[]>(directory)
const loading = ref(false)

let request = 0
watch(term, async (value) => {
  const id = ++request
  loading.value = true
  const found = await searchUsers(value)
  // Ignore an answer that arrives after a newer question.
  if (id !== request) return
  results.value = found
  loading.value = false
})
</script>

<template>
  <!--
    manual-filter: the list is already the server's answer, so the Select
    does not filter it again. Try «hopper» or an email like «edsger@».
  -->
  <Field label="Assignee" hint="Search by name or email." class="w-64">
    <Select v-model="assignee" v-model:search-term="term" searchable manual-filter>
      <SelectTrigger placeholder="Search people" />
      <SelectContent :loading="loading" loading-text="Searching…" empty-text="Nobody found.">
        <SelectItem v-for="user in results" :key="user.id" :value="user.id" :label="user.name">
          <span class="truncate">{{ user.name }}</span>
          <span class="ml-auto truncate pl-2 opacity-70">{{ user.email }}</span>
        </SelectItem>
      </SelectContent>
    </Select>
  </Field>
</template>
