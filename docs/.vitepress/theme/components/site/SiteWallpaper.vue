<script setup lang="ts">
/**
 * The modern desktop's wallpaper (Figma SiteModern/Wallpaper, 1280×800): three
 * ellipses under a 180px layer blur on the desktop colour — light top left,
 * blue bottom right, a second blue (violet in dark) along the bottom. Placed
 * in percent of that frame, so it scales with the window. Windows 98 keeps its
 * flat teal.
 */
</script>

<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 -z-10 overflow-hidden win98:hidden"
  >
    <div
      class="absolute top-[-32.5%] left-[-15.625%] h-[77.5%] w-[59.375%] rounded-full bg-(--rk-wallpaper-a) blur-[90px]"
    />
    <div
      class="absolute top-[47.5%] left-[59.375%] h-[77.5%] w-[59.375%] rounded-full bg-(--rk-wallpaper-b) blur-[90px]"
    />
    <div
      class="absolute top-[70%] left-[20.3125%] h-[52.5%] w-[48.4375%] rounded-full bg-(--rk-wallpaper-c) blur-[90px]"
    />
  </div>
</template>
