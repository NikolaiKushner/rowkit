<script setup lang="ts">
/**
 * The Windows 98 error mark, 16×16: a red disc with a white cross. From the Figma icon set (`icon/16/error`).
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Decorative: the error itself is announced through `aria-invalid` and the Field message.
 */
defineOptions({ name: 'RkErrorIcon' })
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
        d="M5 2h6v1h-6zM3 3h2v1h-2zM11 3h2v1h-2zM2 4h1v1h-1zM13 4h1v1h-1zM2 5h1v1h-1zM13 5h1v1h-1zM1 6h1v1h-1zM14 6h1v1h-1zM1 7h1v1h-1zM14 7h1v1h-1zM1 8h1v1h-1zM14 8h1v1h-1zM1 9h1v1h-1zM14 9h1v1h-1zM2 10h1v1h-1zM13 10h1v1h-1zM2 11h1v1h-1zM13 11h1v1h-1zM3 12h2v1h-2zM11 12h2v1h-2zM5 13h6v1h-6z"
        fill="black"
      />
      <path
        d="M5 3h6v1h-6zM3 4h10v1h-10zM3 5h2v1h-2zM6 5h4v1h-4zM11 5h2v1h-2zM2 6h4v1h-4zM7 6h2v1h-2zM10 6h4v1h-4zM2 7h5v1h-5zM9 7h5v1h-5zM2 8h5v1h-5zM9 8h5v1h-5zM2 9h4v1h-4zM7 9h2v1h-2zM10 9h4v1h-4zM3 10h2v1h-2zM6 10h4v1h-4zM11 10h2v1h-2zM3 11h10v1h-10zM5 12h6v1h-6z"
        fill="#FF0000"
      />
      <path
        d="M5 5h1v1h-1zM10 5h1v1h-1zM6 6h1v1h-1zM9 6h1v1h-1zM7 7h2v1h-2zM7 8h2v1h-2zM6 9h1v1h-1zM9 9h1v1h-1zM5 10h1v1h-1zM10 10h1v1h-1z"
        fill="white"
      />
    </g>
  </svg>
</template>
