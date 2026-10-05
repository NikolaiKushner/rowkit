<script setup lang="ts">
/**
 * The Windows 98 hourglass, 16×16, from the Figma icon set (`icon/16/hourglass`).
 *
 * Pixel art: shown at 16px or an integer multiple, never scaled in between.
 * Decorative — the busy state is announced by `aria-busy` on the control.
 */
defineOptions({ name: 'RkHourglassIcon' })
</script>

<template>
  <svg
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
        d="M3 1h10v1h-10zM3 2h1v1h-1zM12 2h1v1h-1zM4 3h1v1h-1zM11 3h1v1h-1zM4 4h1v1h-1zM11 4h1v1h-1zM5 5h1v1h-1zM10 5h1v1h-1zM6 6h1v1h-1zM9 6h1v1h-1zM7 7h2v1h-2zM7 8h2v1h-2zM6 9h1v1h-1zM9 9h1v1h-1zM5 10h1v1h-1zM10 10h1v1h-1zM4 11h1v1h-1zM11 11h1v1h-1zM4 12h1v1h-1zM11 12h1v1h-1zM3 13h1v1h-1zM12 13h1v1h-1zM3 14h10v1h-10z"
        fill="black"
      />
      <path
        d="M4 2h8v1h-8zM5 3h6v1h-6zM7 9h2v1h-2zM6 10h2v1h-2zM9 10h1v1h-1zM5 11h1v1h-1zM10 11h1v1h-1zM4 13h8v1h-8z"
        fill="white"
      />
      <path
        d="M5 4h6v1h-6zM6 5h4v1h-4zM7 6h2v1h-2zM8 10h1v1h-1zM6 11h4v1h-4zM5 12h6v1h-6z"
        fill="#FFFF00"
      />
    </g>
  </svg>
</template>
