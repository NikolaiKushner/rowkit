<script setup lang="ts">
/**
 * The container every live demo on the site sits in.
 *
 * One component rather than a CSS class per page, so a demo cannot invent its
 * own padding or overflow the page on a phone. The frame is VitePress's (its
 * divider and radius); the face inside is the rowkit theme's own background,
 * so a demo shows its components on the surface they were drawn for —
 * Windows 98's grey or the modern theme's white or dark.
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
  }>(),
  { layout: 'row', align: 'center' }
)

/** Written out in full: Tailwind finds utilities by scanning for literal strings. */
const alignment = { start: 'items-start', center: 'items-center', end: 'items-end' } as const
</script>

<template>
  <div
    class="rk-demo mt-4 overflow-hidden rounded-lg border border-[var(--vp-c-divider)] bg-background text-foreground"
  >
    <div
      class="flex gap-4 overflow-x-auto p-6 max-sm:p-4"
      :class="layout === 'stack' ? 'flex-col' : ['flex-wrap', alignment[align]]"
    >
      <slot />
    </div>
  </div>
</template>
