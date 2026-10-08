<script setup lang="ts">
/**
 * A pencil: edit. 16×16, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Decorative: whatever it marks is said in words or ARIA elsewhere.
 */
defineOptions({ name: 'RkEditIcon' })
</script>

<template>
  <svg
    data-icon="edit"
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
      d="M12 0h2v1h-2zM11 1h1v1h-1zM14 1h1v1h-1zM10 2h1v1h-1zM12 2h1v1h-1zM14 2h1v1h-1zM9 3h1v1h-1zM13 3h1v1h-1zM8 4h1v1h-1zM12 4h1v1h-1zM7 5h1v1h-1zM11 5h1v1h-1zM6 6h1v1h-1zM10 6h1v1h-1zM5 7h1v1h-1zM9 7h1v1h-1zM4 8h1v1h-1zM8 8h1v1h-1zM3 9h1v1h-1zM7 9h1v1h-1zM3 10h1v1h-1zM6 10h1v1h-1zM2 11h4v1h-4zM2 12h2v1h-2z"
      fill="black"
    />
    <path d="M12 1h2v1h-2zM13 2h1v1h-1z" fill="#FF0000" />
    <path
      d="M11 2h1v1h-1zM10 3h3v1h-3zM9 4h3v1h-3zM8 5h3v1h-3zM7 6h3v1h-3zM6 7h3v1h-3zM5 8h3v1h-3zM5 9h2v1h-2z"
      fill="#FFFF00"
    />
    <path d="M4 9h1v1h-1zM4 10h2v1h-2z" fill="white" />
  </svg>
</template>
