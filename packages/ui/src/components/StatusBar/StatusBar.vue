<script setup lang="ts">
import { cn } from '../../utils/cn'
import { statusBarVariants } from './StatusBar.variants'
import type { StatusBarProps } from './types'

defineOptions({ name: 'RkStatusBar' })

const props = defineProps<StatusBarProps>()

defineSlots<{
  /** `StatusBarSection`s. The first fills the width the others leave. */
  default: () => unknown
}>()
</script>

<template>
  <div data-slot="status-bar" :class="cn(statusBarVariants(), props.class)">
    <slot />
  </div>
</template>
