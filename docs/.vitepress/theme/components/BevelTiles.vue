<script setup lang="ts">
import { useCopyToken } from './useCopyToken'

/**
 * Each bevel drawn on an 80×36 tile, its custom property under it. A sunken
 * bevel frames a white field, as it does in a form; the rest sit on silver.
 * A click copies the name.
 */
defineProps<{
  /** `tokens.shadow`, keyed by token name. */
  tokens: Record<string, string>
}>()

const { copied, copy } = useCopyToken()
</script>

<template>
  <ul class="mx-0! mt-4! mb-0! flex list-none flex-wrap gap-x-4 gap-y-3 p-0!">
    <template v-for="(value, name) in tokens" :key="name">
      <li v-if="value !== 'none'" class="m-0!">
        <button
          type="button"
          class="flex cursor-default flex-col items-start gap-1 border-0 bg-transparent p-0 outline-none focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-dotted focus-visible:outline-ring"
          :aria-label="`Copy --shadow-${name}`"
          @click="copy(`--shadow-${name}`)"
        >
          <span
            class="block h-9 w-20 modern:rounded-md"
            :class="String(name).includes('sunken') ? 'bg-input' : 'bg-card'"
            :style="{ boxShadow: value }"
          />
          <span class="font-mono text-mono whitespace-nowrap text-foreground">
            {{ copied === `--shadow-${name}` ? 'copied' : `--shadow-${name}` }}
          </span>
        </button>
      </li>
    </template>
  </ul>
</template>
