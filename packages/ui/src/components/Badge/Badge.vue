<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { cn } from '../../utils/cn'
import { badgeVariants } from './Badge.variants'
import type { BadgeProps } from './types'

defineOptions({ name: 'RkBadge' })

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'neutral',
  appearance: 'subtle',
  size: 'md',
  dot: false,
  as: 'span',
  asChild: false,
})

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
