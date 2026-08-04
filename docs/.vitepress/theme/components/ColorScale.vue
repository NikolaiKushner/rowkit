<script setup lang="ts">
import { useCopyToken } from './useCopyToken'

/**
 * One colour family, rendered from the tokens package.
 *
 * The swatches come from `tokens.color.*` rather than from hand-written HTML,
 * so this page cannot fall out of step with the package — changing a ramp
 * changes the documentation in the same commit.
 */
defineProps<{
  /** Family name, used to build the custom property: `primary` → `--color-primary-600`. */
  name: string
  /** The family itself, keyed by step. */
  scale: Record<number | string, string>
}>()

const { copied, copy } = useCopyToken()
</script>

<template>
  <div class="my-4">
    <p class="!mt-0 !mb-2 font-mono text-sm text-muted-foreground">--color-{{ name }}-*</p>

    <ul class="!m-0 flex flex-wrap gap-2 !p-0" style="list-style: none">
      <li v-for="(value, step) in scale" :key="step" class="!m-0">
        <button
          type="button"
          class="flex w-16 cursor-pointer flex-col gap-1 rounded-sm border-none bg-transparent p-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          :aria-label="`Copy --color-${name}-${step}`"
          @click="copy(`--color-${name}-${step}`)"
        >
          <span
            class="block h-12 w-full rounded-sm border border-border"
            :style="{ background: value }"
          />
          <span class="font-mono text-xs text-muted-foreground">
            {{ copied === `--color-${name}-${step}` ? 'copied' : step }}
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>
