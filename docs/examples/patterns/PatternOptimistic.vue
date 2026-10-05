<script setup lang="ts">
import { ref } from 'vue'
import { Button, ErrorIcon } from 'rowkit'

interface Project {
  id: number
  name: string
  starred: boolean
}

const projects = ref<Project[]>([
  { id: 1, name: 'Apollo', starred: true },
  { id: 2, name: 'Gemini', starred: false },
  { id: 3, name: 'Mercury (fails)', starred: false },
])
const error = ref('')

/** Stands in for PATCH /projects/:id — the third project always fails. */
async function saveStar(project: Project): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  if (project.id === 3) throw new Error('Server error')
}

// Change it on screen at once; put it back, and say so, if the server says no.
async function toggle(project: Project): Promise<void> {
  error.value = ''
  project.starred = !project.starred
  try {
    await saveStar(project)
  } catch {
    project.starred = !project.starred
    error.value = `Could not ${project.starred ? 'unstar' : 'star'} ${project.name}. Nothing changed.`
  }
}
</script>

<template>
  <div class="flex flex-col gap-2 text-ui">
    <ul class="m-0 flex w-64 list-none flex-col gap-1 p-0">
      <li v-for="project in projects" :key="project.id" class="flex items-center justify-between">
        {{ project.name }}
        <Button
          size="xs"
          variant="secondary"
          :pressed="project.starred"
          class="w-20"
          @click="toggle(project)"
        >
          {{ project.starred ? '★ Starred' : '☆ Star' }}
        </Button>
      </li>
    </ul>
    <p v-if="error" role="alert" class="m-0 flex items-center gap-1 text-danger-on-subtle">
      <ErrorIcon />
      {{ error }}
    </p>
  </div>
</template>
