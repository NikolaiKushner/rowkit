<!--
  Adapted from Reka UI's TooltipProvider (MIT).
  Copyright (c) 2023 UnoVue <https://github.com/unovue>
-->
<script setup lang="ts">
import { onBeforeUnmount, provide, ref, toRef } from 'vue'
import { tooltipProviderKey } from './context'

/**
 * Shares tooltip timing across a group — a toolbar, typically.
 *
 * Renders nothing. Prop names match Reka UI's provider, which this replaces,
 * so existing markup keeps working.
 */
defineOptions({ name: 'RkTooltipProvider' })

const props = withDefaults(
  defineProps<{
    /** Delay before a tooltip opens on hover, in milliseconds. */
    delayDuration?: number
    /**
     * After a tooltip closes, how long the next one in the group opens without
     * the delay, in milliseconds. This is what lets a pointer sweep a toolbar.
     */
    skipDelayDuration?: number
    /** Close as soon as the pointer leaves the trigger, even onto the tooltip. Fails WCAG 1.4.13. */
    disableHoverableContent?: boolean
    /** Clicking the trigger does not close its tooltip. */
    disableClosingTrigger?: boolean
    /** Turns off every tooltip in the group. */
    disabled?: boolean
    /** Open on focus only when the focus came from the keyboard (`:focus-visible`). */
    ignoreNonKeyboardFocus?: boolean
  }>(),
  {
    delayDuration: 700,
    skipDelayDuration: 300,
    disableHoverableContent: false,
    disableClosingTrigger: false,
    disabled: false,
    ignoreNonKeyboardFocus: false,
  }
)

defineSlots<{
  /** The tooltips that share this timing. */
  default: () => unknown
}>()

const isOpenDelayed = ref(true)
let skipTimer: number | undefined

provide(tooltipProviderKey, {
  delayDuration: toRef(props, 'delayDuration'),
  isOpenDelayed,
  disableHoverableContent: toRef(props, 'disableHoverableContent'),
  disableClosingTrigger: toRef(props, 'disableClosingTrigger'),
  disabled: toRef(props, 'disabled'),
  ignoreNonKeyboardFocus: toRef(props, 'ignoreNonKeyboardFocus'),
  onOpen: () => {
    window.clearTimeout(skipTimer)
    isOpenDelayed.value = false
  },
  onClose: () => {
    window.clearTimeout(skipTimer)
    skipTimer = window.setTimeout(() => (isOpenDelayed.value = true), props.skipDelayDuration)
  },
})

onBeforeUnmount(() => window.clearTimeout(skipTimer))
</script>

<template>
  <slot />
</template>
