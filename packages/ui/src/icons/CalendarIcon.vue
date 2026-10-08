<script setup lang="ts">
/**
 * A calendar page: date fields and scheduling. 16×16, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Decorative: whatever it marks is said in words or ARIA elsewhere.
 */
defineOptions({ name: 'RkCalendarIcon' })
</script>

<template>
  <svg
    data-icon="calendar"
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
      d="M2 1h12v1h-12zM2 2h1v1h-1zM13 2h1v1h-1zM2 3h1v1h-1zM13 3h1v1h-1zM2 4h12v1h-12zM2 5h1v1h-1zM13 5h1v1h-1zM2 6h1v1h-1zM4 6h1v1h-1zM6 6h1v1h-1zM8 6h1v1h-1zM10 6h1v1h-1zM13 6h1v1h-1zM2 7h1v1h-1zM13 7h1v1h-1zM2 8h1v1h-1zM4 8h1v1h-1zM6 8h1v1h-1zM8 8h1v1h-1zM10 8h1v1h-1zM13 8h1v1h-1zM2 9h1v1h-1zM13 9h1v1h-1zM2 10h1v1h-1zM4 10h1v1h-1zM6 10h1v1h-1zM8 10h1v1h-1zM10 10h1v1h-1zM13 10h1v1h-1zM2 11h1v1h-1zM13 11h1v1h-1zM2 12h12v1h-12z"
      fill="black"
    />
    <path d="M3 2h10v1h-10zM3 3h10v1h-10z" fill="#800000" />
    <path
      d="M3 5h10v1h-10zM3 6h1v1h-1zM5 6h1v1h-1zM7 6h1v1h-1zM9 6h1v1h-1zM11 6h2v1h-2zM3 7h10v1h-10zM3 8h1v1h-1zM5 8h1v1h-1zM7 8h1v1h-1zM9 8h1v1h-1zM11 8h2v1h-2zM3 9h10v1h-10zM3 10h1v1h-1zM5 10h1v1h-1zM7 10h1v1h-1zM9 10h1v1h-1zM11 10h2v1h-2zM3 11h10v1h-10z"
      fill="white"
    />
  </svg>
</template>
