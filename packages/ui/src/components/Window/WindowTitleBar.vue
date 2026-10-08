<script setup lang="ts">
import { cn } from '../../utils/cn'
import { useWindowContext } from './context'
import {
  windowControlsVariants,
  windowTitleBarVariants,
  windowTitleVariants,
} from './Window.variants'
import type { WindowTitleBarProps } from './types'

defineOptions({ name: 'RkWindowTitleBar' })

const props = defineProps<WindowTitleBarProps>()

defineSlots<{
  /** The title, for one that needs markup. Replaces `title`. */
  default: () => unknown
  /** A 16px icon before the title. */
  icon: () => unknown
  /** `WindowButton`s: minimize, maximize or restore, close — in that order. */
  controls: () => unknown
}>()

const win = useWindowContext('WindowTitleBar')
</script>

<template>
  <div data-slot="window-title-bar" :class="cn(windowTitleBarVariants(), props.class)">
    <span
      v-if="$slots.icon"
      class="[display:var(--rk-titlebar-icon)] size-4 shrink-0 items-center justify-center"
    >
      <slot name="icon" />
    </span>
    <span :id="win.titleId" data-slot="window-title" :class="windowTitleVariants()">
      <slot>{{ props.title }}</slot>
    </span>
    <span v-if="$slots.controls" data-slot="window-controls" :class="windowControlsVariants()">
      <slot name="controls" />
    </span>
  </div>
</template>
