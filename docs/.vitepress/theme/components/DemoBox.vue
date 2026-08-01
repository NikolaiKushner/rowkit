<script setup lang="ts">
/**
 * The container every live demo on the site sits in.
 *
 * One component rather than a CSS class per page, so a demo cannot invent its
 * own padding, forget dark mode, or overflow the page on a phone. The border
 * and background come from rowkit's own semantic tokens, which means a demo
 * box on `rowkit.dev` is styled by the package it is demonstrating.
 *
 * Deliberately not a playground: no editable props, no code toggle. That is
 * what the linked Storybook is for, and duplicating it here is how a docs site
 * turns into a second application to maintain.
 */
withDefaults(
  defineProps<{
    /**
     * How the demo's children are arranged.
     *
     * `row` wraps, which is what a set of variants wants. `stack` is for a
     * demo that is one wide thing — a table, a filter bar — where side-by-side
     * would just squash it.
     */
    layout?: 'row' | 'stack'
    /**
     * Cross-axis alignment for `row`. `center` lines up controls of differing
     * heights; `end` is for a form row where the labels sit above.
     */
    align?: 'start' | 'center' | 'end'
    /**
     * Breaks the demo out of the prose column to the full page width.
     *
     * For the landing table only. Body text stays in its measure — a paragraph
     * spanning 1400px is unreadable — but a ten-column table given 1152px of a
     * 1440px window is demonstrating the container, not the component.
     */
    full?: boolean
  }>(),
  { layout: 'row', align: 'center' }
)

/** Written out in full: Tailwind finds utilities by scanning for literal strings. */
const alignment = { start: 'items-start', center: 'items-center', end: 'items-end' } as const
</script>

<template>
  <div
    class="my-6 flex gap-4 overflow-x-auto rounded-lg border border-border bg-surface p-6"
    :class="[
      layout === 'stack' ? 'flex-col' : ['flex-wrap', alignment[align]],
      full ? 'rk-demo-full' : '',
    ]"
  >
    <slot />
  </div>
</template>
