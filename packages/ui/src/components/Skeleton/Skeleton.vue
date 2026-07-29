<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { cn } from '../../utils/cn'
import { skeletonVariants } from './Skeleton.variants'

import type { SkeletonProps } from './types'

defineOptions({ name: 'RkSkeleton' })

const props = withDefaults(defineProps<SkeletonProps>(), {
  variant: 'text',
  lines: 1,
  animated: true,
  as: 'div',
  asChild: false,
})

/**
 * Multiple bars need a container to space them, so the root stops being the
 * placeholder itself and becomes a wrapper. One bar keeps the root as the
 * placeholder rather than wrapping a single child in a pointless element.
 */
const isStack = computed(() => props.variant === 'text' && props.lines > 1)

/**
 * `aria-busy` alongside `role="status"`: the role makes the region a live one,
 * and `aria-busy` is what actually says the content is still arriving.
 */
const a11yAttrs = computed(() =>
  props.label === undefined
    ? ({ 'aria-hidden': 'true' } as const)
    : ({ role: 'status', 'aria-busy': 'true', 'aria-label': props.label } as const)
)
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    v-bind="a11yAttrs"
    :class="
      isStack
        ? cn('flex w-full flex-col gap-2', props.class)
        : cn(skeletonVariants({ variant: props.variant, animated: props.animated }), props.class)
    "
  >
    <span
      v-for="line in isStack ? props.lines : 0"
      :key="line"
      :class="
        cn(
          skeletonVariants({ variant: 'text', animated: props.animated }),
          // Shortening the last bar is the whole reason a stack reads as prose.
          line === props.lines && 'w-3/4'
        )
      "
    />
  </Primitive>
</template>
