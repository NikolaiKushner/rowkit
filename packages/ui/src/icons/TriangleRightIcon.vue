<script setup lang="ts">
/**
 * A solid right-pointing triangle: next-page buttons and submenu arrows. 8×8, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Drawn in `currentColor`, so it greys out with a disabled control.
 */
defineOptions({ name: 'RkTriangleRightIcon' })
</script>

<template>
  <svg
    data-icon="triangle-right"
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
      d="M3 1h1v1h-1zM3 2h2v1h-2zM3 3h3v1h-3zM3 4h4v1h-4zM3 5h3v1h-3zM3 6h2v1h-2zM3 7h1v1h-1z"
      fill="currentColor"
    />
  </svg>
</template>
