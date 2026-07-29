<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'
import { cn } from '../../utils/cn'
import { buttonVariants } from './Button.variants'

import type { ButtonProps } from './types'

defineOptions({ name: 'RkButton' })

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  loading: false,
  disabled: false,
  type: 'button',
  as: 'button',
  asChild: false,
})

defineSlots<{
  /** The button label. */
  default: () => unknown
  /** Icon before the label. Replaced by the spinner while loading. */
  leading: () => unknown
  /** Icon after the label. */
  trailing: () => unknown
}>()

/**
 * `disabled` on a native button removes it from the tab order, which is the
 * right behaviour for a genuinely unavailable action but the wrong one for a
 * button that is merely busy — focus would jump to the document body the
 * moment the user submits.
 */
const isNativeButton = computed(() => props.as === 'button' && !props.asChild)

/**
 * `aria-busy:pointer-events-none` stops the mouse, but not the keyboard and
 * not a programmatic `.click()`. Without this guard, holding Enter on a
 * loading submit button fires the handler repeatedly.
 *
 * Capture phase, so it runs before the listeners a consumer attached through
 * fallthrough attributes.
 */
function onClickCapture(event: MouseEvent): void {
  if (props.loading || props.disabled) {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
}
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :type="isNativeButton ? props.type : undefined"
    :disabled="isNativeButton && props.disabled ? true : undefined"
    :aria-disabled="!isNativeButton && props.disabled ? 'true' : undefined"
    :aria-busy="props.loading ? 'true' : undefined"
    :class="
      cn(
        buttonVariants({ variant: props.variant, size: props.size, block: props.block }),
        props.class
      )
    "
    @click.capture="onClickCapture"
  >
    <svg
      v-if="props.loading"
      class="size-4 shrink-0 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25" stroke-width="3" />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
    <span v-else-if="$slots.leading" class="flex shrink-0 items-center">
      <slot name="leading" />
    </span>

    <span class="truncate"><slot /></span>

    <span v-if="$slots.trailing" class="flex shrink-0 items-center">
      <slot name="trailing" />
    </span>

    <!--
      Only rendered when the consumer supplies a loading label, so the default
      is an unchanged accessible name plus aria-busy rather than a label that
      silently rewrites itself under a screen reader.
    -->
    <span v-if="props.loading && props.loadingLabel" class="sr-only" role="status">
      {{ props.loadingLabel }}
    </span>
  </Primitive>
</template>
