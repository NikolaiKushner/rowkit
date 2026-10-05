<script setup lang="ts">
import { GroupBox } from 'rowkit'
/**
 * The container every live demo on the site sits in.
 *
 * One component rather than a CSS class per page, so a demo cannot invent its
 * own padding or overflow the page on a phone. It is rowkit's own GroupBox,
 * so a demo box on `rowkit.dev` is drawn by the package it is demonstrating.
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
  <!--
    The Figma page draws a demo as a group box captioned «Example» on the
    window face. It is a plain group, not a fieldset: a demo is not a form.
  -->
  <GroupBox as="div" legend="Example" class="rk-demo mt-4">
    <div
      class="flex gap-4 overflow-x-auto p-1"
      :class="layout === 'stack' ? 'flex-col' : ['flex-wrap', alignment[align]]"
    >
      <slot />
    </div>
  </GroupBox>
</template>
