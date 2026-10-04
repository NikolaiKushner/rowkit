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
      <path
        d="M4 2H5V3H4V2ZM3 3H4V4H3V3ZM4 3H5V4H4V3ZM5 3H6V4H5V3ZM2 4H3V5H2V4ZM3 4H4V5H3V4ZM4 4H5V5H4V4ZM5 4H6V5H5V4ZM6 4H7V5H6V4ZM1 5H2V6H1V5ZM2 5H3V6H2V5ZM3 5H4V6H3V5ZM4 5H5V6H4V5ZM5 5H6V6H5V5ZM6 5H7V6H6V5ZM7 5H8V6H7V5Z"
        fill="currentColor"
      />
    </g>
  </svg>
</template>
