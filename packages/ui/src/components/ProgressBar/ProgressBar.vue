<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { cn } from '../../utils/cn'
import { progressBarFillVariants, progressBarVariants } from './ProgressBar.variants'
import type { ProgressBarProps } from './types'

defineOptions({ name: 'RkProgressBar' })

const props = withDefaults(defineProps<ProgressBarProps>(), {
  value: null,
  max: 100,
})

/** No value: how much is left is unknown. */
const indeterminate = computed(() => props.value === null)

/** Clamped to the range, so a stray value never overflows the track. */
const clamped = computed(() => {
  const max = props.max > 0 ? props.max : 100
  return Math.min(Math.max(props.value ?? 0, 0), max)
})

const percent = computed(() => (clamped.value / (props.max > 0 ? props.max : 100)) * 100)

const root = ref<HTMLElement>()
const fillEl = ref<HTMLElement>()

/**
 * Where the travelling segment can go, measured from the track: how many
 * steps of one period fit before it starts again at the left, and the offset
 * that stands it in the middle. The theme's animation and reduced-motion rule
 * read them; Windows 98 needs them because its blocks step a fixed 10px, so
 * the count depends on how wide the bar is.
 */
const travel = ref<{ steps: number; middle: number }>()

function measure(): void {
  const track = root.value
  const segment = fillEl.value
  if (!track || !segment || !indeterminate.value) return
  const style = getComputedStyle(track)
  const inner = track.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
  const period = parseFloat(style.getPropertyValue('--spacing-progress-period')) || 1
  travel.value = {
    steps: Math.max(1, Math.floor(inner / period) - 1),
    middle: Math.max(0, Math.floor((inner - segment.offsetWidth) / 2 / period) * period),
  }
}

let observer: ResizeObserver | undefined

onMounted(() => {
  measure()
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    observer = new ResizeObserver(measure)
    observer.observe(root.value)
  }
})

// A bar that loses its value and becomes indeterminate measures again.
watch(indeterminate, measure, { flush: 'post' })

onBeforeUnmount(() => observer?.disconnect())

const fillStyle = computed(() => {
  if (!indeterminate.value) return { '--rk-progress': `${String(percent.value)}%` }
  if (!travel.value) return undefined
  return {
    '--rk-progress-steps': String(travel.value.steps),
    '--rk-progress-middle': `${String(travel.value.middle)}px`,
  }
})
</script>

<template>
  <div
    ref="root"
    role="progressbar"
    data-slot="progress-bar"
    aria-valuemin="0"
    :aria-valuemax="props.max"
    :aria-valuenow="indeterminate ? undefined : clamped"
    :data-state="indeterminate ? 'indeterminate' : undefined"
    :class="cn(progressBarVariants(), props.class)"
  >
    <!--
      Name it with aria-label or aria-labelledby: a progress bar with no name
      tells a screen reader "62%" of nothing in particular.
    -->
    <div
      ref="fillEl"
      data-slot="progress-bar-fill"
      :class="progressBarFillVariants({ indeterminate })"
      :style="fillStyle"
    />
  </div>
</template>
