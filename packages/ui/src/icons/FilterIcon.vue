<script setup lang="ts">
/**
 * A funnel: filter. 16×16, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Decorative: whatever it marks is said in words or ARIA elsewhere.
 */
defineOptions({ name: 'RkFilterIcon' })
</script>

<template>
  <svg
    data-icon="filter"
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
      d="M1 1h14v1h-14zM1 2h1v1h-1zM14 2h1v1h-1zM2 3h1v1h-1zM13 3h1v1h-1zM3 4h1v1h-1zM12 4h1v1h-1zM4 5h1v1h-1zM11 5h1v1h-1zM5 6h1v1h-1zM10 6h1v1h-1zM6 7h1v1h-1zM9 7h1v1h-1zM6 8h1v1h-1zM9 8h1v1h-1zM6 9h1v1h-1zM9 9h1v1h-1zM6 10h1v1h-1zM9 10h1v1h-1zM6 11h1v1h-1zM8 11h2v1h-2zM6 12h3v1h-3z"
      fill="black"
    />
    <path
      d="M2 2h12v1h-12zM3 3h10v1h-10zM4 4h8v1h-8zM5 5h6v1h-6zM6 6h4v1h-4zM7 7h2v1h-2zM7 8h2v1h-2zM7 9h2v1h-2zM7 10h2v1h-2zM7 11h1v1h-1z"
      fill="white"
    />
  </svg>
</template>
