<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Book32Icon, Computer32Icon, Document32Icon, Folder32Icon } from 'rowkit'
import type { NavNode } from './useSiteNav'
import { siteTheme } from './useSiteTheme'

/**
 * The page header in the Windows 98 «web view» style: the section's 32px icon
 * at twice its size, the title, and a rule fading from navy.
 */
const props = defineProps<{
  title: string
  current: NavNode | undefined
}>()

const icons: Record<string, Component> = {
  Guide: Book32Icon,
  Components: Folder32Icon,
  'Foundations · Tokens': Computer32Icon,
}

// By the top folder; a folder's own page, by the folder itself. The modern
// theme draws a folder for every page (Figma Site/WebViewHeader).
const icon = computed(() =>
  siteTheme.value === 'modern'
    ? Folder32Icon
    : (icons[(props.current?.path[0] ?? props.current)?.text ?? ''] ?? Document32Icon)
)
</script>

<template>
  <!-- Modern (Figma Site/WebViewHeader): a 48px icon, the title in semibold, a hairline under. -->
  <header class="flex flex-col gap-2 modern:gap-3">
    <div class="flex items-center gap-3">
      <!-- 32px pixel art drawn at 2×: a whole-number scale keeps every pixel square. -->
      <component :is="icon" class="size-16 shrink-0 modern:size-12" />
      <h1 class="m-0 text-doc-h1 font-bold text-foreground modern:font-strong">{{ title }}</h1>
    </div>
    <div
      class="h-[3px] bg-linear-to-r from-titlebar-from to-transparent modern:h-px modern:bg-none modern:bg-border"
    />
  </header>
</template>
