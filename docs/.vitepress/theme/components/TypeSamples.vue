<script setup lang="ts">
import { computed } from 'vue'

/**
 * The type scale, each line set in the style it names: «ui/body · PT Sans
 * 11/13 — controls, menus, cells». Sizes come from the tokens package, in
 * pixels, so the line reads the way the design's text styles do.
 */
const props = defineProps<{
  /** `tokens.font.size`: size and line height per style, in rem. */
  sizes: Record<string, { size: string; lineHeight: string }>
}>()

/** Each style's name in the design, what it is for, and how it is set. */
const styles: Record<string, { label: string; use: string; bold?: boolean; mono?: boolean }> = {
  'ui/bold': { label: 'ui/bold', use: 'window titles', bold: true },
  ui: { label: 'ui/body', use: 'controls, menus, cells' },
  heading: { label: 'ui/heading', use: 'dialog and group titles', bold: true },
  mono: { label: 'mono', use: 'numbers, code', mono: true },
  doc: { label: 'doc/body', use: 'articles like this one' },
  'doc-h1': { label: 'doc/h1', use: 'page titles', bold: true },
  'doc-h2': { label: 'doc/h2', use: 'sections', bold: true },
  'doc-h3': { label: 'doc/h3', use: 'sub-sections', bold: true },
}

const px = (rem: string) => Math.round(parseFloat(rem) * 16)

const lines = computed(() =>
  Object.entries(props.sizes).flatMap(([name, { size, lineHeight }]) => {
    // The interface's bold is a style of its own in the design, at the ui size.
    const names = name === 'ui' ? ['ui/bold', 'ui'] : [name]
    return names.map((style) => {
      const info = styles[style] ?? { label: style, use: '' }
      const face = info.mono ? 'VT323' : info.bold ? 'PT Sans Bold' : 'PT Sans'
      return {
        style,
        text: `${info.label} · ${face} ${String(px(size))}/${String(px(lineHeight))}${info.use ? ` — ${info.use}` : ''}`,
        css: {
          fontSize: size,
          lineHeight,
          fontWeight: info.bold ? 700 : 400,
          fontFamily: info.mono ? 'var(--font-mono)' : 'var(--font-sans)',
        },
      }
    })
  })
)
</script>

<template>
  <ul class="mx-0! mt-4! mb-0! flex list-none flex-col gap-2 p-0!">
    <li v-for="line in lines" :key="line.style" class="m-0! text-foreground" :style="line.css">
      {{ line.text }}
    </li>
  </ul>
</template>
