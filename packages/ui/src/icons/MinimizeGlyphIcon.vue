<script setup lang="ts">
/**
 * The minimize glyph of a title-bar button: a bar along the bottom. 8×8, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Drawn in `currentColor`, so it greys out with a disabled control.
 */
defineOptions({ name: 'RkMinimizeGlyphIcon' })
</script>

<template>
  <svg
    data-icon="minimize-glyph"
    aria-hidden="true"
    focusable="false"
    preserveAspectRatio="none"
    width="8"
    height="7"
    overflow="visible"
    style="display: block"
    viewBox="0 0 8 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 5h6v1h-6zM1 6h6v1h-6z" fill="currentColor" />
  </svg>
</template>
