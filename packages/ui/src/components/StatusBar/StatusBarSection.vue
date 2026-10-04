<script setup lang="ts">
import { cn } from '../../utils/cn'
import { statusBarSectionVariants } from './StatusBar.variants'
import type { StatusBarSectionProps } from './types'

defineOptions({ name: 'RkStatusBarSection' })

const props = defineProps<StatusBarSectionProps>()

defineSlots<{
  /** A short line of text, an icon and text, or a small control. */
  default: () => unknown
}>()
</script>

<template>
  <div data-slot="status-bar-section" :class="cn(statusBarSectionVariants(), props.class)">
    <slot />
  </div>
</template>
