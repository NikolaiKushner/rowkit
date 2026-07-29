<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'
import { skeletonVariants, type SkeletonVariants } from './Skeleton.variants'

defineOptions({ name: 'RkSkeleton' })

const props = withDefaults(
  defineProps<{
    /** Geometry preset. */
    variant?: NonNullable<SkeletonVariants['variant']>
    /**
     * Number of stacked bars. Only meaningful for `text`.
     *
     * The last bar is shortened, because real paragraphs do not end flush with
     * the margin and a stack of equal bars reads as a table, not prose.
     */
    lines?: number
    /**
     * Whether the placeholder pulses. Suppressed automatically for anyone with
     * `prefers-reduced-motion`.
     */
    animated?: boolean
    /**
     * Announces this placeholder to assistive technology as a busy region.
     *
     * Omitted, the skeleton is `aria-hidden` — which is the right default,
     * because a loading table renders dozens of these and a reader should hear
     * "Loading users" once, not once per cell. Set it on the single element
     * that stands for the whole region.
     */
    label?: string
    /**
     * Additional classes, merged with the variant classes so a consumer's
     * utility wins over the component's own.
     */
    class?: HTMLAttributes['class']
    /** Element or component to render as. */
    as?: PrimitiveProps['as']
    /** Merge props onto the single child element instead of rendering a wrapper. */
    asChild?: PrimitiveProps['asChild']
  }>(),
  {
    variant: 'text',
    lines: 1,
    animated: true,
    as: 'div',
    asChild: false,
  }
)

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
