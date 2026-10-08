<script setup lang="ts">
/**
 * The maximize glyph of a title-bar button: a window frame with a thick top edge. 9×9, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Drawn in `currentColor`, so it greys out with a disabled control.
 */
defineOptions({ name: 'RkMaximizeGlyphIcon' })
</script>

<template>
  <svg
    data-icon="maximize-glyph"
    aria-hidden="true"
    focusable="false"
    preserveAspectRatio="none"
    width="9"
    height="9"
    overflow="visible"
    style="display: block"
    viewBox="0 0 9 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 0h9v1h-9zM0 1h9v1h-9zM0 2h1v1h-1zM8 2h1v1h-1zM0 3h1v1h-1zM8 3h1v1h-1zM0 4h1v1h-1zM8 4h1v1h-1zM0 5h1v1h-1zM8 5h1v1h-1zM0 6h1v1h-1zM8 6h1v1h-1zM0 7h1v1h-1zM8 7h1v1h-1zM0 8h9v1h-9z"
      fill="currentColor"
    />
  </svg>
</template>
