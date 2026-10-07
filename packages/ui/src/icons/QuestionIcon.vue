<script setup lang="ts">
/**
 * A question mark in a disc: help. 16×16, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Decorative: whatever it marks is said in words or ARIA elsewhere.
 */
defineOptions({ name: 'RkQuestionIcon' })
</script>

<template>
  <svg
    data-icon="question"
    aria-hidden="true"
    focusable="false"
    preserveAspectRatio="none"
    width="16"
    height="16"
    overflow="visible"
    style="display: block"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 1h6v1h-6zM3 2h2v1h-2zM11 2h2v1h-2zM2 3h1v1h-1zM13 3h1v1h-1zM2 4h1v1h-1zM13 4h1v1h-1zM1 5h1v1h-1zM14 5h1v1h-1zM1 6h1v1h-1zM14 6h1v1h-1zM1 7h1v1h-1zM14 7h1v1h-1zM1 8h1v1h-1zM14 8h1v1h-1zM1 9h1v1h-1zM14 9h1v1h-1zM2 10h1v1h-1zM13 10h1v1h-1zM2 11h1v1h-1zM13 11h1v1h-1zM3 12h2v1h-2zM11 12h2v1h-2zM5 13h6v1h-6z"
      fill="black"
    />
    <path
      d="M5 2h6v1h-6zM3 3h3v1h-3zM10 3h3v1h-3zM3 4h2v1h-2zM7 4h2v1h-2zM11 4h2v1h-2zM2 5h7v1h-7zM11 5h3v1h-3zM2 6h6v1h-6zM10 6h4v1h-4zM2 7h5v1h-5zM9 7h5v1h-5zM2 8h5v1h-5zM9 8h5v1h-5zM2 9h12v1h-12zM3 10h4v1h-4zM9 10h4v1h-4zM3 11h4v1h-4zM9 11h4v1h-4zM5 12h6v1h-6z"
      fill="white"
    />
    <path
      d="M6 3h4v1h-4zM5 4h2v1h-2zM9 4h2v1h-2zM9 5h2v1h-2zM8 6h2v1h-2zM7 7h2v1h-2zM7 8h2v1h-2zM7 10h2v1h-2zM7 11h2v1h-2z"
      fill="#0000FF"
    />
  </svg>
</template>
