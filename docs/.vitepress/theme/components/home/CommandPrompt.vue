<script setup lang="ts">
import { ref } from 'vue'
import { Window, WindowButton, WindowTitleBar } from 'rowkit'

/**
 * The install command in a Command Prompt window: a black screen, light grey
 * mono text and a block cursor blinking every 500ms. Clicking the screen
 * copies the command.
 */
withDefaults(defineProps<{ closable?: boolean }>(), { closable: false })
defineEmits<{ close: [] }>()

const command = 'pnpm add rowkit@beta'
const copied = ref(false)

async function copy(): Promise<void> {
  await navigator.clipboard.writeText(command)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <Window>
    <WindowTitleBar title="Command Prompt">
      <template v-if="closable" #controls>
        <WindowButton glyph="minimize" label="Minimize Command Prompt" @click="$emit('close')" />
        <WindowButton glyph="maximize" label="Maximize" disabled />
        <WindowButton glyph="close" label="Close Command Prompt" @click="$emit('close')" />
      </template>
    </WindowTitleBar>
    <button
      type="button"
      class="flex w-full cursor-pointer flex-col items-start gap-0.5 bg-foreground px-2 pt-1.5 pb-2 text-left font-mono text-mono text-border-subtle shadow-sunken outline-none focus-visible:outline-1 focus-visible:-outline-offset-4 focus-visible:outline-dotted focus-visible:outline-border-subtle"
      :aria-label="
        copied ? 'Copied: pnpm add rowkit@beta' : 'Copy the install command: pnpm add rowkit@beta'
      "
      @click="copy"
    >
      <span>C:\&gt; {{ command }}</span>
      <span class="flex items-end">
        C:\&gt;&nbsp;<span v-if="copied">Copied.</span
        ><span class="rk-cursor mb-px h-[3px] w-2 bg-border-subtle" />
      </span>
    </button>
  </Window>
</template>

<style scoped>
/* The block cursor: on and off every 500ms, held on for anyone avoiding motion. */
@media (prefers-reduced-motion: no-preference) {
  .rk-cursor {
    animation: rk-blink 1s steps(1) infinite;
  }
}

@keyframes rk-blink {
  50% {
    opacity: 0;
  }
}
</style>
