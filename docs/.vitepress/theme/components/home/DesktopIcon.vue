<script setup lang="ts">
/**
 * A desktop shortcut: a 32px icon over a white 11px label on the teal desktop.
 * Focused, the label turns navy inside a dotted white ring. On the site one
 * click opens it — a link, not Windows' select-then-double-click.
 */
const props = defineProps<{
  label: string
  href: string
}>()

const external = /^https?:/.test(props.href)
</script>

<template>
  <a
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noreferrer' : undefined"
    :title="label"
    class="group flex w-[76px] flex-col items-center gap-1 text-ui no-underline outline-none modern:w-auto modern:rounded-xl modern:focus-visible:focus-outer"
  >
    <!-- In the Dock: a tile, the label for assistive technology and the tooltip. -->
    <span
      class="size-8 modern:flex modern:size-12 modern:items-center modern:justify-center modern:rounded-xl modern:bg-card modern:text-foreground modern:shadow-raised modern:transition-transform modern:group-hover:-translate-y-1"
      ><slot
    /></span>
    <span
      class="border border-transparent px-px pb-px text-center whitespace-nowrap text-on-selected group-focus-visible:border-dotted group-focus-visible:border-on-selected group-focus-visible:bg-surface-selected modern:sr-only"
      >{{ label }}</span
    >
  </a>
</template>
