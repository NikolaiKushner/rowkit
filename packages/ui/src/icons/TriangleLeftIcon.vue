<script setup lang="ts">
/**
 * A solid leftward-pointing triangle, 8×8: previous-page buttons. The Figma icon set's `icon/8/triangle-left`, drawn as the down triangle turned on its side.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Drawn in `currentColor`, so it greys out with a disabled control.
 */
defineOptions({ name: 'RkTriangleLeftIcon' })
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
      <path
        d="M5 1h1v1h-1zM4 2h2v1h-2zM3 3h3v1h-3zM2 4h4v1h-4zM3 5h3v1h-3zM4 6h2v1h-2zM5 7h1v1h-1z"
        fill="currentColor"
      />
    </g>
  </svg>
</template>
