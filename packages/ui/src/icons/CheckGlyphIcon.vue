<script setup lang="ts">
/**
 * The Windows 98 check mark, a 7×7 glyph for check boxes. 7×7, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Drawn in `currentColor`, so it greys out with a disabled control.
 */
defineOptions({ name: 'RkCheckGlyphIcon' })
</script>

<template>
  <svg
    data-icon="check-glyph"
    aria-hidden="true"
    focusable="false"
    preserveAspectRatio="none"
    overflow="visible"
    style="display: block"
    width="7"
    height="7"
    viewBox="0 0 7 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M6 0h1v1h-1zM5 1h2v1h-2zM0 2h1v1h-1zM4 2h3v1h-3zM0 3h2v1h-2zM3 3h3v1h-3zM0 4h5v1h-5zM1 5h3v1h-3zM2 6h1v1h-1z"
        fill="currentColor"
      />
    </g>
  </svg>
</template>
