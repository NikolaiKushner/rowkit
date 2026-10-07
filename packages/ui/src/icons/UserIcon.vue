<script setup lang="ts">
/**
 * A person: a user or an account. 16×16, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Decorative: whatever it marks is said in words or ARIA elsewhere.
 */
defineOptions({ name: 'RkUserIcon' })
</script>

<template>
  <svg
    data-icon="user"
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
      d="M6 1h4v1h-4zM5 2h1v1h-1zM10 2h1v1h-1zM4 3h1v1h-1zM11 3h1v1h-1zM4 4h1v1h-1zM11 4h1v1h-1zM4 5h1v1h-1zM11 5h1v1h-1zM5 6h1v1h-1zM10 6h1v1h-1zM6 7h4v1h-4zM4 8h2v1h-2zM10 8h2v1h-2zM3 9h1v1h-1zM12 9h1v1h-1zM2 10h1v1h-1zM13 10h1v1h-1zM2 11h1v1h-1zM13 11h1v1h-1zM2 12h1v1h-1zM13 12h1v1h-1zM2 13h12v1h-12z"
      fill="black"
    />
    <path
      d="M6 2h4v1h-4zM5 3h2v1h-2zM9 3h2v1h-2zM5 4h1v1h-1zM10 4h1v1h-1zM5 5h2v1h-2zM9 5h2v1h-2zM6 6h4v1h-4z"
      fill="#DFDFDF"
    />
    <path d="M7 3h2v1h-2zM6 4h4v1h-4zM7 5h2v1h-2z" fill="white" />
    <path
      d="M6 8h4v1h-4zM4 9h8v1h-8zM3 10h10v1h-10zM3 11h10v1h-10zM3 12h10v1h-10z"
      fill="#008080"
    />
  </svg>
</template>
