<script setup lang="ts">
import { computed, onUnmounted, provide, ref } from 'vue'
import { tooltipGroupKey } from './context'

/**
 * Shares tooltip timing across a group — a toolbar, typically.
 *
 * Renders nothing. Its prop names (`delayDuration`, `skipDelayDuration`) are
 * kept stable, so existing markup keeps working.
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
    delayDuration: 500,
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

/*
 * The group is "warm" while the user is reading labels: a tooltip in it is
 * open, or one closed less than `skipDelayDuration` ago. The delay is there to
 * tell a pointer passing through from one that stopped on purpose, and once a
 * label has been read the user has shown which they are.
 */
const showing = ref(0)
const recentlyClosed = ref(false)
let cooldown: ReturnType<typeof setTimeout> | undefined

function stopCooldown(): void {
  if (cooldown !== undefined) clearTimeout(cooldown)
  cooldown = undefined
}

provide(tooltipGroupKey, {
  delay: computed(() => props.delayDuration),
  warm: computed(() => showing.value > 0 || recentlyClosed.value),
  hoverableContent: computed(() => !props.disableHoverableContent),
  closesOnActivate: computed(() => !props.disableClosingTrigger),
  keyboardFocusOnly: computed(() => props.ignoreNonKeyboardFocus),
  disabled: computed(() => props.disabled),
  opened() {
    stopCooldown()
    showing.value += 1
  },
  closed() {
    showing.value = Math.max(0, showing.value - 1)
    if (showing.value > 0) return
    stopCooldown()
    if (props.skipDelayDuration <= 0) {
      recentlyClosed.value = false
      return
    }
    recentlyClosed.value = true
    cooldown = setTimeout(() => {
      cooldown = undefined
      recentlyClosed.value = false
    }, props.skipDelayDuration)
  },
})

// After the tooltips inside have closed and reported it.
onUnmounted(stopCooldown)
</script>

<template>
  <slot />
</template>
