<script setup lang="ts">
import { computed, ref } from 'vue'
import { Window, WindowButton, WindowTitleBar } from 'rowkit'
import { siteTheme } from '../site/useSiteTheme'

/**
 * The install command in a Command Prompt window: a black screen, light grey
 * mono text and a block cursor blinking every 500ms. Clicking the screen
 * copies the command. In the modern theme the same window is a Terminal.
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

/** The prompt each system's shell shows. */
const prompt = computed(() => (siteTheme.value === 'modern' ? '~ %' : 'C:\\>'))
</script>

<template>
  <Window>
    <WindowTitleBar :title="siteTheme === 'modern' ? 'Terminal' : 'Command Prompt'">
      <template v-if="closable" #controls>
        <WindowButton glyph="minimize" label="Minimize Command Prompt" @click="$emit('close')" />
        <WindowButton glyph="maximize" label="Maximize" disabled />
        <WindowButton glyph="close" label="Close Command Prompt" @click="$emit('close')" />
      </template>
    </WindowTitleBar>
    <button
      type="button"
      class="flex w-full cursor-pointer flex-col items-start gap-0.5 bg-foreground px-2 pt-1.5 pb-2 text-left font-mono text-mono text-border-subtle shadow-sunken outline-none focus-visible:outline-1 focus-visible:-outline-offset-4 focus-visible:outline-dotted focus-visible:outline-border-subtle modern:bg-(--color-modern-gray-950) modern:px-3 modern:pt-2 modern:pb-3 modern:text-(--color-modern-gray-150) modern:shadow-none"
      :aria-label="
        copied ? 'Copied: pnpm add rowkit@beta' : 'Copy the install command: pnpm add rowkit@beta'
      "
      @click="copy"
    >
      <span>{{ prompt }} {{ command }}</span>
      <span class="flex items-end">
        {{ prompt }}&nbsp;<span v-if="copied">Copied.</span
        ><span
          class="rk-cursor mb-px h-[3px] w-2 bg-border-subtle modern:bg-(--color-modern-gray-150)"
        />
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
