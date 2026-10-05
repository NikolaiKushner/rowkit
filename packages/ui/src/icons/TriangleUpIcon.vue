<script setup lang="ts">
/**
 * A solid upward triangle, 8×8: spin buttons and scroll arrows. From the Figma icon set (`icon/8/triangle-up`).
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Drawn in `currentColor`, so it greys out with a disabled control.
 */
defineOptions({ name: 'RkTriangleUpIcon' })
</script>

<template>
  <svg
    aria-hidden="true"
    focusable="false"
    preserveAspectRatio="none"
    overflow="visible"
    style="display: block"
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path d="M4 2h1v1h-1zM3 3h3v1h-3zM2 4h5v1h-5zM1 5h7v1h-7z" fill="currentColor" />
    </g>
  </svg>
</template>
