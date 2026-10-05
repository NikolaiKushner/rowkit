<script setup lang="ts">
/**
 * A solid downward triangle, 8×8: spin buttons, drop buttons and scroll arrows. From the Figma icon set (`icon/8/triangle-down`).
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Drawn in `currentColor`, so it greys out with a disabled control.
 */
defineOptions({ name: 'RkTriangleDownIcon' })
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
      <path d="M1 2h7v1h-7zM2 3h5v1h-5zM3 4h3v1h-3zM4 5h1v1h-1z" fill="currentColor" />
    </g>
  </svg>
</template>
