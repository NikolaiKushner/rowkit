<script setup lang="ts">
import { withBase } from 'vitepress'

/**
 * The six «Built like a professional tool» icons (Figma Site icons): a line
 * drawing at 24px in the modern theme, on a vermilion plaque; the 32px pixel
 * drawing in Windows 98.
 */
export type SiteIconName = 'typed' | 'accessible' | 'behaviour' | 'tokens' | 'ssr' | 'agents'

defineProps<{ name: SiteIconName }>()

/** The outline drawings, stroked in currentColor. */
const PATHS: Record<SiteIconName, string[]> = {
  typed: [
    'M9 4C7 4 6.5 5 6.5 6.5V9.5C6.5 10.6 5.6 12 4 12C5.6 12 6.5 13.4 6.5 14.5V17.5C6.5 19 7 20 9 20M15 4C17 4 17.5 5 17.5 6.5V9.5C17.5 10.6 18.4 12 20 12C18.4 12 17.5 13.4 17.5 14.5V17.5C17.5 19 17 20 15 20',
  ],
  accessible: [
    'M5 8.5L12 10M12 10L19 8.5M12 10V14.5M12 14.5L9 21M12 14.5L15 21',
    'M13 4.75a1 1 0 1 1-2 0a1 1 0 1 1 2 0Z',
  ],
  behaviour: ['M3.5 12L12 16.5L20.5 12M3.5 16L12 20.5L20.5 16M12 3.5L20.5 8L12 12.5L3.5 8L12 3.5Z'],
  tokens: [
    'M10.5 4.5H4.5V10.5H10.5V4.5Z',
    'M19.5 4.5H13.5V10.5H19.5V4.5Z',
    'M10.5 13.5H4.5V19.5H10.5V13.5Z',
    'M18.75 16.5a2.25 2.25 0 1 1-4.5 0a2.25 2.25 0 1 1 4.5 0Z',
  ],
  ssr: ['M8 7.25H8.01M8 16.75H8.01M12 10V14M4.5 4.5H19.5V10H4.5V4.5ZM4.5 14H19.5V19.5H4.5V14Z'],
  agents: [
    'M18.5 16V20M16.5 18H20.5M12 3.5L13.9 9.1L19.5 11L13.9 12.9L12 18.5L10.1 12.9L4.5 11L10.1 9.1L12 3.5Z',
  ],
}
</script>

<template>
  <span
    class="flex size-9 items-center justify-center rounded-lg bg-(--lp-accent-soft) text-(--lp-accent) win98:hidden"
    aria-hidden="true"
  >
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor">
      <path
        v-for="d in PATHS[name]"
        :key="d"
        :d="d"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
  <img
    :src="withBase(`/icons/site/${name}-32.png`)"
    alt=""
    width="32"
    height="32"
    class="[image-rendering:pixelated] modern:hidden"
  />
</template>
