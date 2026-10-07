<script setup lang="ts">
/**
 * An open yellow folder. 16×16, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Decorative: whatever it marks is said in words or ARIA elsewhere.
 */
defineOptions({ name: 'RkFolderOpenIcon' })
</script>

<template>
  <svg
    data-icon="folder-open"
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
      d="M1 2h5v1h-5zM0 3h1v1h-1zM6 3h1v1h-1zM0 4h1v1h-1zM7 4h7v1h-7zM0 5h1v1h-1zM13 5h1v1h-1zM0 6h1v1h-1zM5 6h11v1h-11zM0 7h1v1h-1zM4 7h1v1h-1zM15 7h1v1h-1zM0 8h1v1h-1zM3 8h1v1h-1zM14 8h1v1h-1zM0 9h1v1h-1zM2 9h1v1h-1zM14 9h1v1h-1zM0 10h2v1h-2zM13 10h1v1h-1zM0 11h14v1h-14z"
      fill="black"
    />
    <path
      d="M1 3h2v1h-2zM4 3h2v1h-2zM1 4h1v1h-1zM3 4h4v1h-4zM2 5h11v1h-11zM1 6h4v1h-4zM1 7h3v1h-3zM5 7h10v1h-10zM1 8h2v1h-2zM4 8h10v1h-10zM1 9h1v1h-1zM3 9h11v1h-11zM2 10h11v1h-11z"
      fill="#FFFF00"
    />
    <path d="M3 3h1v1h-1zM2 4h1v1h-1zM1 5h1v1h-1z" fill="white" />
  </svg>
</template>
