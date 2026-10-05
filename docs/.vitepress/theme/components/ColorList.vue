<script setup lang="ts">
import { useCopyToken } from './useCopyToken'

/**
 * Semantic colours as a list: a 16px swatch in a sunken frame and the custom
 * property in the mono face, in columns 250px wide. A click copies the name.
 */
defineProps<{
  /** `tokens.color.semantic`, keyed by token name. */
  tokens: Record<string, string>
}>()

const { copied, copy } = useCopyToken()
</script>

<template>
  <ul class="mx-0! mt-4! mb-0! flex list-none flex-wrap gap-x-4 gap-y-2 p-0!">
    <li v-for="(_, name) in tokens" :key="name" class="m-0! w-[250px]">
      <button
        type="button"
        class="flex cursor-default items-center gap-2 border-0 bg-transparent p-0 text-left outline-none focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-dotted focus-visible:outline-ring"
        :aria-label="`Copy --color-${name}`"
        @click="copy(`--color-${name}`)"
      >
        <span class="block size-5 shrink-0 bg-card p-0.5 shadow-sunken">
          <span class="block size-4" :style="{ background: `var(--color-${name})` }" />
        </span>
        <span class="font-mono text-mono whitespace-nowrap text-foreground">
          {{ copied === `--color-${name}` ? 'copied' : `--color-${name}` }}
        </span>
      </button>
    </li>
  </ul>
</template>
