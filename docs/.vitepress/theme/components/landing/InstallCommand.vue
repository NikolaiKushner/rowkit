<script setup lang="ts">
import { ref } from 'vue'
import { Button } from 'rowkit'

/** The install command, with a button that copies it. */
const COMMAND = 'npm i rowkit@beta'

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy(): Promise<void> {
  // No clipboard API on an insecure origin: the command is on screen to select.
  try {
    await navigator.clipboard.writeText(COMMAND)
  } catch {
    return
  }
  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (copied.value = false), 1600)
}
</script>

<template>
  <div
    class="flex h-12 items-center gap-3 bg-(--lp-code-bg) pr-1.5 pl-4 text-(--lp-code-fg) modern:rounded-[10px] modern:border modern:border-border win98:shadow-sunken"
  >
    <code class="lp-code flex-1 text-left whitespace-nowrap">
      <span class="lp-code-comment select-none" aria-hidden="true">$ </span>{{ COMMAND }}
    </code>
    <Button variant="secondary" class="shrink-0" @click="copy">
      {{ copied ? 'Copied' : 'Copy' }}
    </Button>
    <span class="sr-only" aria-live="polite">{{ copied ? 'Copied to the clipboard' : '' }}</span>
  </div>
</template>
