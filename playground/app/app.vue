<script setup lang="ts">
import { Button } from 'rowkit'
import { ref } from 'vue'

/**
 * Shell for the playground. Two pages: the Phase 2 form, and the Phase 3
 * users-admin table.
 */

const isDark = ref(false)
function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<template>
  <div class="min-h-screen bg-background text-text">
    <header class="border-b border-border bg-surface">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <nav class="flex items-center gap-1" aria-label="Playground">
          <NuxtLink
            to="/"
            class="rounded-sm px-3 py-1.5 text-sm font-medium text-text-muted hover:bg-surface-hover hover:text-text"
            active-class="bg-surface-subtle text-text"
          >
            Invite form
          </NuxtLink>
          <NuxtLink
            to="/users"
            class="rounded-sm px-3 py-1.5 text-sm font-medium text-text-muted hover:bg-surface-hover hover:text-text"
            active-class="bg-surface-subtle text-text"
          >
            Users admin
          </NuxtLink>
        </nav>

        <Button variant="ghost" size="sm" @click="toggleTheme">
          {{ isDark ? 'Light' : 'Dark' }}
        </Button>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-6 py-10">
      <NuxtPage />
    </main>
  </div>
</template>
