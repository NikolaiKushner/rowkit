<script setup lang="ts">
/**
 * The Windows 98 magnifier, 16×16. From the Figma icon set (`icon/16/search`).
 *
 * Pixel art: shown at its own size or an integer multiple, never scaled in
 * between. Decorative: the field it sits in is labelled on its own.
 */
defineOptions({ name: 'RkSearchIcon' })
</script>

<template>
  <svg
    data-icon="search"
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
        d="M4 1h4v1h-4zM3 2h1v1h-1zM8 2h1v1h-1zM2 3h1v1h-1zM9 3h1v1h-1zM2 4h1v1h-1zM9 4h1v1h-1zM2 5h1v1h-1zM9 5h1v1h-1zM2 6h1v1h-1zM9 6h1v1h-1zM3 7h1v1h-1zM8 7h1v1h-1zM4 8h4v1h-4zM9 8h1v1h-1zM9 9h2v1h-2zM10 10h2v1h-2zM11 11h2v1h-2zM12 12h2v1h-2zM13 13h1v1h-1z"
        fill="black"
      />
      <path
        d="M4 2h4v1h-4zM3 3h2v1h-2zM7 3h2v1h-2zM3 4h1v1h-1zM5 4h4v1h-4zM3 5h6v1h-6zM3 6h6v1h-6zM4 7h4v1h-4z"
        fill="white"
      />
      <path d="M5 3h2v1h-2zM4 4h1v1h-1z" fill="#DFDFDF" />
      <path d="M8 8h1v1h-1z" fill="#808080" />
    </g>
  </svg>
</template>
