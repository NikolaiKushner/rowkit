<script setup lang="ts">
import { computed, type Component } from 'vue'
import { Book32Icon, Computer32Icon, Document32Icon, Folder32Icon } from 'rowkit'
import type { NavNode } from './useSiteNav'

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

// By the top folder; a folder's own page, by the folder itself.
const icon = computed(
  () => icons[(props.current?.path[0] ?? props.current)?.text ?? ''] ?? Document32Icon
)
</script>

<template>
  <header class="flex flex-col gap-2">
    <div class="flex items-center gap-3">
      <!-- 32px pixel art drawn at 2×: a whole-number scale keeps every pixel square. -->
      <component :is="icon" class="size-16 shrink-0" />
      <h1 class="m-0 text-[24px] leading-[28px] font-bold text-foreground">{{ title }}</h1>
    </div>
    <div class="h-[3px] bg-linear-to-r from-titlebar-from to-transparent" />
  </header>
</template>
