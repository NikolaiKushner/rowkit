<script setup lang="ts">
/**
 * The Windows 98 warning mark: a yellow triangle with a black exclamation point. 16×16, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Decorative: whatever it marks is said in words or ARIA elsewhere.
 */
defineOptions({ name: 'RkWarningIcon' })
</script>

<template>
  <svg
    data-icon="warning"
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
        d="M7 0h2v1h-2zM6 1h1v1h-1zM9 1h1v1h-1zM6 2h1v1h-1zM9 2h1v1h-1zM5 3h1v1h-1zM10 3h1v1h-1zM5 4h1v1h-1zM7 4h2v1h-2zM10 4h1v1h-1zM4 5h1v1h-1zM7 5h2v1h-2zM11 5h1v1h-1zM4 6h1v1h-1zM7 6h2v1h-2zM11 6h1v1h-1zM3 7h1v1h-1zM7 7h2v1h-2zM12 7h1v1h-1zM3 8h1v1h-1zM7 8h2v1h-2zM12 8h1v1h-1zM2 9h1v1h-1zM13 9h1v1h-1zM2 10h1v1h-1zM7 10h2v1h-2zM13 10h1v1h-1zM1 11h1v1h-1zM7 11h2v1h-2zM14 11h1v1h-1zM1 12h1v1h-1zM14 12h1v1h-1zM0 13h16v1h-16z"
        fill="black"
      />
      <path
        d="M7 1h2v1h-2zM7 2h2v1h-2zM6 3h4v1h-4zM6 4h1v1h-1zM9 4h1v1h-1zM5 5h2v1h-2zM9 5h2v1h-2zM5 6h2v1h-2zM9 6h2v1h-2zM4 7h3v1h-3zM9 7h3v1h-3zM4 8h3v1h-3zM9 8h3v1h-3zM3 9h10v1h-10zM3 10h4v1h-4zM9 10h4v1h-4zM2 11h5v1h-5zM9 11h5v1h-5zM2 12h12v1h-12z"
        fill="#FFFF00"
      />
    </g>
  </svg>
</template>
