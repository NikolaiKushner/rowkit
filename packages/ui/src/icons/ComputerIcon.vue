<script setup lang="ts">
/**
 * A computer: devices, the system, "this machine". 16×16, from the Figma icon set.
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Decorative: whatever it marks is said in words or ARIA elsewhere.
 */
defineOptions({ name: 'RkComputerIcon' })
</script>

<template>
  <svg
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
      d="M1 1h13v1h-13zM1 2h1v1h-1zM13 2h1v1h-1zM1 3h1v1h-1zM13 3h1v1h-1zM1 4h1v1h-1zM13 4h1v1h-1zM1 5h1v1h-1zM13 5h1v1h-1zM1 6h1v1h-1zM13 6h1v1h-1zM1 7h1v1h-1zM13 7h1v1h-1zM1 8h1v1h-1zM13 8h1v1h-1zM1 9h13v1h-13zM5 10h1v1h-1zM10 10h1v1h-1zM3 11h10v1h-10zM2 12h1v1h-1zM13 12h1v1h-1zM2 13h12v1h-12z"
      fill="black"
    />
    <path
      d="M2 2h11v1h-11zM2 3h1v1h-1zM12 3h1v1h-1zM2 4h1v1h-1zM12 4h1v1h-1zM2 5h1v1h-1zM12 5h1v1h-1zM2 6h1v1h-1zM12 6h1v1h-1zM2 7h1v1h-1zM12 7h1v1h-1zM2 8h11v1h-11zM6 10h4v1h-4zM3 12h10v1h-10z"
      fill="#C0C0C0"
    />
    <path d="M3 3h9v1h-9zM3 4h1v1h-1zM3 5h1v1h-1zM3 6h1v1h-1zM3 7h1v1h-1z" fill="#808080" />
    <path d="M4 4h7v1h-7zM4 5h7v1h-7zM4 6h7v1h-7z" fill="#008080" />
    <path d="M11 4h1v1h-1zM11 5h1v1h-1zM11 6h1v1h-1zM4 7h8v1h-8z" fill="white" />
  </svg>
</template>
