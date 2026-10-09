<script setup lang="ts">
import { watch } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ComponentsLook from './ComponentsLook.vue'
import { setSiteDark } from './useSiteTheme'

/**
 * VitePress's default layout with one addition: the switch for the theme the
 * examples are drawn in — in the nav bar from 1280px, above the page's content
 * where the nav bar is full, in the menu on a phone. VitePress's dark mode also turns the
 * modern examples dark.
 */
const { isDark } = useData()

watch(
  isDark,
  (value) => {
    if (typeof document !== 'undefined') setSiteDark(value)
  },
  { immediate: true }
)
</script>

<template>
  <DefaultTheme.Layout>
    <template #nav-bar-content-after>
      <ComponentsLook class="in-nav" />
    </template>
    <template #doc-before>
      <ComponentsLook class="in-doc" />
    </template>
    <template #nav-screen-content-after>
      <ComponentsLook class="in-screen" />
    </template>
  </DefaultTheme.Layout>
</template>
