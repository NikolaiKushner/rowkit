<script setup lang="ts">
/**
 * The restore glyph of a title-bar button: two overlapping window frames. 8×8, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Drawn in `currentColor`, so it greys out with a disabled control.
 */
defineOptions({ name: 'RkRestoreGlyphIcon' })
</script>

<template>
  <svg
    data-icon="restore-glyph"
    aria-hidden="true"
    focusable="false"
    preserveAspectRatio="none"
    width="8"
    height="8"
    overflow="visible"
    style="display: block"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 0h6v1h-6zM2 1h6v1h-6zM2 2h1v1h-1zM7 2h1v1h-1zM0 3h6v1h-6zM7 3h1v1h-1zM0 4h6v1h-6zM7 4h1v1h-1zM0 5h1v1h-1zM5 5h3v1h-3zM0 6h1v1h-1zM5 6h1v1h-1zM0 7h6v1h-6z"
      fill="currentColor"
    />
  </svg>
</template>
