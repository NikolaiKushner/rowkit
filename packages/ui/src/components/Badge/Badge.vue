<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'
import { badgeVariants, type BadgeVariants } from './Badge.variants'

defineOptions({ name: 'RkBadge' })

const props = withDefaults(
  defineProps<{
    /**
     * Status family. `neutral` is the "no particular status" default rather
     * than an absence of styling.
     */
    variant?: NonNullable<BadgeVariants['variant']>
    /**
     * How much visual weight the badge carries. Prefer `subtle` in a table —
     * a column of `solid` badges reads as a wall of colour and stops
     * communicating anything.
     */
    appearance?: NonNullable<BadgeVariants['appearance']>
    /** Badge size. `sm` is intended for dense table rows. */
    size?: NonNullable<BadgeVariants['size']>
    /**
     * Shows a filled dot before the label, inheriting the text colour.
     *
     * Useful when the same badge appears many times in a column and the eye
     * needs a shape to lock onto rather than a colour.
     */
    dot?: boolean
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
    variant: 'neutral',
    appearance: 'subtle',
    size: 'md',
    dot: false,
    as: 'span',
    asChild: false,
  }
)

defineSlots<{
  /** Badge content. Keep it to a word or two — this is a label, not a container. */
  default: () => unknown
}>()
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :class="
      cn(
        badgeVariants({ variant: props.variant, appearance: props.appearance, size: props.size }),
        props.class
      )
    "
  >
    <!--
      The dot is decorative: it repeats the colour the badge already carries,
      and the label is always present. Hiding it from assistive tech avoids
      announcing a meaningless element before every status.
    -->
    <span v-if="props.dot" aria-hidden="true" class="size-1.5 shrink-0 rounded-full bg-current" />
    <span class="truncate"><slot /></span>
  </Primitive>
</template>
