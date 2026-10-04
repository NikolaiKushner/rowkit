<script setup lang="ts">
import { useId } from 'vue'
import { cn } from '../../utils/cn'
import { provideWindowContext } from './context'
import { windowVariants } from './Window.variants'
import type { WindowProps } from './types'

defineOptions({ name: 'RkWindow' })

const props = withDefaults(defineProps<WindowProps>(), {
  active: true,
})

defineSlots<{
  /** `WindowTitleBar`, `WindowBody`, and a `StatusBar` if the window has one. */
  default: () => unknown
}>()

const titleId = useId()
provideWindowContext({ titleId })
</script>

<template>
  <!-- A section named by its title, so a screen reader can find it by name. -->
  <section
    data-slot="window"
    :aria-labelledby="titleId"
    :data-inactive="props.active ? undefined : ''"
    :class="cn(windowVariants(), props.class)"
  >
    <slot />
  </section>
</template>
