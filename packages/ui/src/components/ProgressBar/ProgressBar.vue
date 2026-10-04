<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../utils/cn'
import { progressBarFillVariants, progressBarVariants } from './ProgressBar.variants'
import type { ProgressBarProps } from './types'

defineOptions({ name: 'RkProgressBar' })

const props = withDefaults(defineProps<ProgressBarProps>(), {
  max: 100,
})

/** Clamped to the range, so a stray value never overflows the track. */
const clamped = computed(() => {
  const max = props.max > 0 ? props.max : 100
  return Math.min(Math.max(props.value, 0), max)
})

const percent = computed(() => (clamped.value / (props.max > 0 ? props.max : 100)) * 100)
</script>

<template>
  <div
    role="progressbar"
    data-slot="progress-bar"
    aria-valuemin="0"
    :aria-valuemax="props.max"
    :aria-valuenow="clamped"
    :class="cn(progressBarVariants(), props.class)"
  >
    <!--
      Name it with aria-label or aria-labelledby: a progress bar with no name
      tells a screen reader "62%" of nothing in particular.
    -->
    <div
      data-slot="progress-bar-fill"
      :class="progressBarFillVariants()"
      :style="{ '--rk-progress': `${percent}%` }"
    />
  </div>
</template>
