<script setup lang="ts">
import { computed, inject, onBeforeUnmount, provide, ref, useId, watch } from 'vue'
import { TOOLTIP_OPEN, tooltipKey, tooltipProviderKey } from './context'

/** Open state and timing for one tooltip. Internal: `Tooltip` renders it. */
defineOptions({ name: 'RkTooltipRoot' })

const props = defineProps<{ delay: number | undefined; disabled: boolean }>()

defineSlots<{ default: () => unknown }>()

const provider = inject(tooltipProviderKey)
if (!provider) throw new Error('TooltipRoot needs a TooltipProvider above it.')

const open = ref(false)
const wasDelayed = ref(false)
const delay = computed(() => props.delay ?? provider.delayDuration.value)
let delayTimer: number | undefined

watch(open, (isOpen) => {
  if (isOpen) {
    provider.onOpen()
    document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN))
  } else {
    provider.onClose()
  }
})

function openNow(): void {
  window.clearTimeout(delayTimer)
  wasDelayed.value = false
  open.value = true
}

function close(): void {
  window.clearTimeout(delayTimer)
  open.value = false
}

onBeforeUnmount(() => window.clearTimeout(delayTimer))

const disableHoverableContent = provider.disableHoverableContent

provide(tooltipKey, {
  contentId: useId(),
  open,
  state: computed(() => {
    if (!open.value) return 'closed'
    return wasDelayed.value ? 'delayed-open' : 'instant-open'
  }),
  trigger: ref<HTMLElement>(),
  onTriggerEnter: () => {
    if (!provider.isOpenDelayed.value) {
      openNow()
      return
    }
    window.clearTimeout(delayTimer)
    delayTimer = window.setTimeout(() => {
      wasDelayed.value = true
      open.value = true
    }, delay.value)
  },
  onTriggerLeave: () => {
    if (disableHoverableContent.value) close()
    // Otherwise the content keeps it open while the pointer travels onto it.
    else window.clearTimeout(delayTimer)
  },
  onOpen: openNow,
  onClose: close,
  disableHoverableContent,
  disableClosingTrigger: provider.disableClosingTrigger,
  disabled: computed(() => props.disabled || provider.disabled.value),
  ignoreNonKeyboardFocus: provider.ignoreNonKeyboardFocus,
})
</script>

<template>
  <slot />
</template>
