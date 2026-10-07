<script setup lang="ts">
/**
 * A closed yellow folder. 16×16, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Decorative: whatever it marks is said in words or ARIA elsewhere.
 */
defineOptions({ name: 'RkFolderIcon' })
</script>

<template>
  <svg
    data-icon="folder"
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
      d="M1 2h5v1h-5zM0 3h1v1h-1zM6 3h1v1h-1zM0 4h1v1h-1zM7 4h9v1h-9zM0 5h1v1h-1zM15 5h1v1h-1zM0 6h1v1h-1zM15 6h1v1h-1zM0 7h1v1h-1zM15 7h1v1h-1zM0 8h1v1h-1zM15 8h1v1h-1zM0 9h1v1h-1zM15 9h1v1h-1zM0 10h1v1h-1zM15 10h1v1h-1zM0 11h1v1h-1zM15 11h1v1h-1zM0 12h1v1h-1zM15 12h1v1h-1zM0 13h1v1h-1zM15 13h1v1h-1zM0 14h16v1h-16z"
      fill="black"
    />
    <path
      d="M1 3h2v1h-2zM4 3h2v1h-2zM1 4h1v1h-1zM3 4h4v1h-4zM2 5h13v1h-13zM1 6h13v1h-13zM1 7h13v1h-13zM1 8h13v1h-13zM1 9h13v1h-13zM1 10h13v1h-13zM1 11h13v1h-13zM1 12h13v1h-13z"
      fill="#FFFF00"
    />
    <path d="M3 3h1v1h-1zM2 4h1v1h-1zM1 5h1v1h-1z" fill="white" />
    <path
      d="M14 6h1v1h-1zM14 7h1v1h-1zM14 8h1v1h-1zM14 9h1v1h-1zM14 10h1v1h-1zM14 11h1v1h-1zM14 12h1v1h-1zM1 13h14v1h-14z"
      fill="#808000"
    />
  </svg>
</template>
