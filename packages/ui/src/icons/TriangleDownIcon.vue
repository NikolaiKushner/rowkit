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
      <path
        d="M1 2H2V3H1V2ZM2 2H3V3H2V2ZM3 2H4V3H3V2ZM4 2H5V3H4V2ZM5 2H6V3H5V2ZM6 2H7V3H6V2ZM7 2H8V3H7V2ZM2 3H3V4H2V3ZM3 3H4V4H3V3ZM4 3H5V4H4V3ZM5 3H6V4H5V3ZM6 3H7V4H6V3ZM3 4H4V5H3V4ZM4 4H5V5H4V4ZM5 4H6V5H5V4ZM4 5H5V6H4V5Z"
        fill="currentColor"
      />
    </g>
  </svg>
</template>
