<script setup lang="ts">
/**
 * A page with a folded corner: a document or a file. 16×16, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Decorative: whatever it marks is said in words or ARIA elsewhere.
 */
defineOptions({ name: 'RkDocumentIcon' })
</script>

<template>
  <svg
    data-icon="document"
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
      d="M2 0h8v1h-8zM2 1h1v1h-1zM9 1h2v1h-2zM2 2h1v1h-1zM9 2h1v1h-1zM11 2h1v1h-1zM2 3h1v1h-1zM9 3h4v1h-4zM2 4h1v1h-1zM12 4h1v1h-1zM2 5h1v1h-1zM12 5h1v1h-1zM2 6h1v1h-1zM12 6h1v1h-1zM2 7h1v1h-1zM12 7h1v1h-1zM2 8h1v1h-1zM12 8h1v1h-1zM2 9h1v1h-1zM12 9h1v1h-1zM2 10h1v1h-1zM12 10h1v1h-1zM2 11h1v1h-1zM12 11h1v1h-1zM2 12h1v1h-1zM12 12h1v1h-1zM2 13h11v1h-11z"
      fill="black"
    />
    <path
      d="M3 1h6v1h-6zM3 2h6v1h-6zM10 2h1v1h-1zM3 3h1v1h-1zM8 3h1v1h-1zM3 4h9v1h-9zM3 5h1v1h-1zM11 5h1v1h-1zM3 6h9v1h-9zM3 7h1v1h-1zM11 7h1v1h-1zM3 8h9v1h-9zM3 9h1v1h-1zM11 9h1v1h-1zM3 10h9v1h-9zM3 11h1v1h-1zM9 11h3v1h-3zM3 12h9v1h-9z"
      fill="white"
    />
    <path d="M4 3h4v1h-4zM4 5h7v1h-7zM4 7h7v1h-7zM4 9h7v1h-7zM4 11h5v1h-5z" fill="#808080" />
  </svg>
</template>
