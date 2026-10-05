<script setup lang="ts">
import { cn } from '../../utils/cn'
import { separatorVariants } from './Separator.variants'
import type { SeparatorProps } from './types'

defineOptions({ name: 'RkSeparator' })

const props = withDefaults(defineProps<SeparatorProps>(), {
  orientation: 'horizontal',
  decorative: false,
})
</script>

<template>
  <div
    data-slot="separator"
    :role="props.decorative ? 'none' : 'separator'"
    :aria-orientation="
      !props.decorative && props.orientation === 'vertical' ? 'vertical' : undefined
    "
    :data-orientation="props.orientation"
    :class="cn(separatorVariants({ orientation: props.orientation }), props.class)"
  >
    <!--
      A div, not <hr>: an <hr> is always horizontal to assistive technology and
      brings margins and borders from every reset.
    -->
  </div>
</template>
