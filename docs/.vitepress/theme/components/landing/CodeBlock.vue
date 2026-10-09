<script setup lang="ts">
import { computed } from 'vue'
import { highlight } from './highlight'

/**
 * A code sample on the landing page, coloured by `highlight.ts`.
 *
 * `panel` is a sample on its own, framed like a card; `inset` sits inside a
 * card (the steps of «Start in a minute»), sunken like a field in Windows 98.
 */
const props = withDefaults(
  defineProps<{
    code: string
    /** What the sample is, for a screen reader: a <pre> has no name of its own. */
    label: string
    variant?: 'panel' | 'inset'
  }>(),
  { variant: 'panel' }
)

const lines = computed(() => highlight(props.code))
</script>

<template>
  <pre
    :aria-label="label"
    tabindex="0"
    class="lp-code m-0 overflow-x-auto bg-(--lp-code-bg) font-mono text-(--lp-code-fg) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--lp-accent)"
    :class="
      variant === 'panel'
        ? 'px-6 py-5 modern:rounded-xl modern:border modern:border-border-subtle modern-dark:border-border win98:border win98:border-[#808080]'
        : 'px-3 py-2.5 modern:rounded-lg modern:border modern:border-border-subtle modern-dark:border-border win98:shadow-sunken'
    "
  ><code><template v-for="(line, i) in lines" :key="i"><span
    v-for="(token, j) in line"
    :key="j"
    :class="token.kind !== 'plain' && `lp-code-${token.kind}`"
  >{{ token.text }}</span>{{ i < lines.length - 1 ? '\n' : '' }}</template></code></pre>
</template>
