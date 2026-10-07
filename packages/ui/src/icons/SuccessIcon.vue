<script setup lang="ts">
/**
 * A success mark in the Windows 98 palette: a green disc with a white check. 16×16, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Decorative: whatever it marks is said in words or ARIA elsewhere.
 */
defineOptions({ name: 'RkSuccessIcon' })
</script>

<template>
  <svg
    data-icon="success"
    aria-hidden="true"
    focusable="false"
    preserveAspectRatio="none"
    overflow="visible"
    style="display: block"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M5 1h6v1h-6zM3 2h2v1h-2zM11 2h2v1h-2zM2 3h1v1h-1zM13 3h1v1h-1zM2 4h1v1h-1zM13 4h1v1h-1zM1 5h1v1h-1zM14 5h1v1h-1zM1 6h1v1h-1zM14 6h1v1h-1zM1 7h1v1h-1zM14 7h1v1h-1zM1 8h1v1h-1zM14 8h1v1h-1zM1 9h1v1h-1zM14 9h1v1h-1zM2 10h1v1h-1zM13 10h1v1h-1zM2 11h1v1h-1zM13 11h1v1h-1zM3 12h2v1h-2zM11 12h2v1h-2zM5 13h6v1h-6z"
        fill="black"
      />
      <path
        d="M5 2h6v1h-6zM3 3h10v1h-10zM3 4h8v1h-8zM12 4h1v1h-1zM2 5h8v1h-8zM12 5h2v1h-2zM2 6h7v1h-7zM11 6h3v1h-3zM2 7h2v1h-2zM5 7h3v1h-3zM10 7h4v1h-4zM2 8h2v1h-2zM6 8h1v1h-1zM9 8h5v1h-5zM2 9h3v1h-3zM8 9h6v1h-6zM3 10h3v1h-3zM7 10h6v1h-6zM3 11h10v1h-10zM5 12h6v1h-6z"
        fill="#008000"
      />
      <path
        d="M11 4h1v1h-1zM10 5h2v1h-2zM9 6h2v1h-2zM4 7h1v1h-1zM8 7h2v1h-2zM4 8h2v1h-2zM7 8h2v1h-2zM5 9h3v1h-3zM6 10h1v1h-1z"
        fill="white"
      />
    </g>
  </svg>
</template>
