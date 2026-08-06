<script setup lang="ts">
import { Button } from 'rowkit'
import { ref } from 'vue'

/**
 * Shell for the playground. Three pages: the Phase 2 form, the Phase 3
 * users-admin table, and the Phase 4 overlay stacking scene.
 */

const isDark = ref(false)
function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

const linkClass =
  'rounded-sm px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
const activeClass = 'bg-card text-foreground shadow-xs'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="border-b border-border bg-card">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <nav
          class="inline-flex items-center gap-0.5 rounded-md border border-border bg-muted p-0.5"
          aria-label="Playground"
        >
          <NuxtLink to="/" :class="linkClass" active-class="" :exact-active-class="activeClass">
            Invite form
          </NuxtLink>
          <NuxtLink
            to="/users"
            :class="linkClass"
            active-class=""
            :exact-active-class="activeClass"
          >
            Users admin
          </NuxtLink>
          <NuxtLink
            to="/overlays"
            :class="linkClass"
            active-class=""
            :exact-active-class="activeClass"
          >
            Overlays
          </NuxtLink>
        </nav>

        <Button variant="ghost" size="sm" @click="toggleTheme">
          {{ isDark ? 'Light' : 'Dark' }}
        </Button>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-6 py-8">
      <NuxtPage />
    </main>
  </div>
</template>
