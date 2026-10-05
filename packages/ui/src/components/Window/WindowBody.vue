<script setup lang="ts">
import { cn } from '../../utils/cn'
import { windowBodyVariants } from './Window.variants'
import type { WindowBodyProps } from './types'

defineOptions({ name: 'RkWindowBody' })

const props = defineProps<WindowBodyProps>()

defineSlots<{
  /** The window's content. */
  default: () => unknown
}>()
</script>

<template>
  <div data-slot="window-body" :class="cn(windowBodyVariants(), props.class)">
    <slot />
  </div>
</template>
