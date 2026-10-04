<script setup lang="ts">
/**
 * A solid rightward-pointing triangle, 8×8: next-page buttons and submenu arrows. The Figma icon set's `icon/8/triangle-right`, drawn as the down triangle turned on its side.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Drawn in `currentColor`, so it greys out with a disabled control.
 */
defineOptions({ name: 'RkTriangleRightIcon' })
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
        d="M2 1h1v1h-1zM2 2h2v1h-2zM2 3h3v1h-3zM2 4h4v1h-4zM2 5h3v1h-3zM2 6h2v1h-2zM2 7h1v1h-1z"
        fill="currentColor"
      />
    </g>
  </svg>
</template>
