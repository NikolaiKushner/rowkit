<script setup lang="ts">
/**
 * The Windows 98 option button, 12×12, from the Figma primitive (`Radio`):
 * a pixel-drawn round bevel, the one round thing in the system.
 *
 * One drawing for every state. The bevel is in the bevel tokens; the well and
 * the dot read two variables the control sets from its input's state:
 * `--rk-radio-well` (white, or silver while pressed or disabled) and
 * `--rk-radio-dot` (`currentColor` when checked, `transparent` when not).
 */
defineOptions({ name: 'RkRadioMark' })
</script>

<template>
  <svg
    aria-hidden="true"
    focusable="false"
    preserveAspectRatio="none"
    overflow="visible"
    style="display: block"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M4 0h4v1h-4zM2 1h2v1h-2zM8 1h2v1h-2zM1 2h1v1h-1zM1 3h1v1h-1zM0 4h1v1h-1zM0 5h1v1h-1zM0 6h1v1h-1zM0 7h1v1h-1zM1 8h1v1h-1z"
        fill="var(--color-bevel-shadow)"
      />
      <path
        d="M10 2h1v1h-1zM10 3h1v1h-1zM11 4h1v1h-1zM11 5h1v1h-1zM11 6h1v1h-1zM11 7h1v1h-1zM10 8h1v1h-1zM1 9h1v1h-1zM10 9h1v1h-1zM2 10h2v1h-2zM8 10h2v1h-2zM4 11h4v1h-4z"
        fill="var(--color-bevel-highlight)"
      />
      <path
        d="M4 1h4v1h-4zM2 2h2v1h-2zM2 3h1v1h-1zM1 4h1v1h-1zM1 5h1v1h-1zM1 6h1v1h-1zM1 7h1v1h-1zM2 8h1v1h-1z"
        fill="var(--color-bevel-dark)"
      />
      <path
        d="M9 2h1v1h-1zM9 3h1v1h-1zM10 4h1v1h-1zM10 5h1v1h-1zM10 6h1v1h-1zM10 7h1v1h-1zM9 8h1v1h-1zM2 9h2v1h-2zM8 9h2v1h-2zM4 10h4v1h-4z"
        fill="var(--color-bevel-light)"
      />
      <path
        d="M4 2h5v1h-5zM3 3h6v1h-6zM2 4h8v1h-8zM2 5h8v1h-8zM2 6h8v1h-8zM2 7h8v1h-8zM3 8h6v1h-6zM4 9h4v1h-4z"
        fill="var(--rk-radio-well)"
      />
      <path d="M5 4h2v1h-2zM4 5h4v1h-4zM4 6h4v1h-4zM5 7h2v1h-2z" fill="var(--rk-radio-dot)" />
    </g>
  </svg>
</template>
