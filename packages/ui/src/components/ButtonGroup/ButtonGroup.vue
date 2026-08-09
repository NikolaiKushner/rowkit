<script setup lang="ts">
import { cn } from '../../utils/cn'
import { buttonGroupVariants } from './ButtonGroup.variants'

import type { ButtonGroupProps } from './types'

defineOptions({ name: 'RkButtonGroup' })

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  orientation: 'horizontal',
})

defineSlots<{
  /** Buttons (or nested groups) to join. */
  default: () => unknown
}>()
</script>

<template>
  <div
    role="group"
    data-slot="button-group"
    :aria-label="props.ariaLabel"
    :data-orientation="props.orientation"
    :class="cn(buttonGroupVariants({ orientation: props.orientation }), props.class)"
  >
    <slot />
  </div>
</template>
