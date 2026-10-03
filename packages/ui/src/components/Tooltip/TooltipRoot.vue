<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref, useId, watch } from 'vue'
import { isClient } from '../../primitives/dom'
import {
  leaveScreen,
  takeScreen,
  tooltipKey,
  useTooltipGroup,
  type TooltipState,
  type TooltipTriggerListeners,
} from './context'

/**
 * The state of one tooltip, and the rules for when it shows.
 *
 * It shows while the user is pointing at the trigger or has focused it, and
 * the two are tracked apart: losing one does not close a tooltip the other
 * still holds open. Hover pays the group's delay unless the group is warm;
 * focus never does. Once dismissed — Escape, activating the trigger, a press
 * elsewhere — it stays shut until the pointer comes back or focus does.
 */
defineOptions({ name: 'RkTooltipRoot' })

const props = defineProps<{ disabled: boolean }>()

defineSlots<{ default: () => unknown }>()

const group = useTooltipGroup('TooltipRoot')

const open = ref(false)
const waited = ref(false)
const triggerElement = ref<HTMLElement>()
const bubbleElement = ref<HTMLElement>()

/** The pointer is on the trigger, or on its way across to the bubble. */
const pointing = ref(false)
/** The trigger has focus of a kind that shows the tooltip. */
let focused = false
/**
 * A pointer is pressed on the trigger. The focus a press gives a button is a
 * side effect of clicking it, not a request for its label.
 */
let pressing = false
let pending: ReturnType<typeof setTimeout> | undefined

const disabled = computed(() => props.disabled || group.disabled.value)

function cancelPending(): void {
  if (pending !== undefined) clearTimeout(pending)
  pending = undefined
}

function show(afterDelay: boolean): void {
  cancelPending()
  if (open.value || disabled.value) return
  takeScreen(hide)
  group.opened()
  waited.value = afterDelay
  open.value = true
}

function hide(): void {
  cancelPending()
  pointing.value = false
  focused = false
  if (!open.value) return
  open.value = false
  leaveScreen(hide)
  group.closed()
}

function startPointing(): void {
  pointing.value = true
  if (open.value || pending !== undefined || disabled.value) return
  const delay = group.delay.value
  if (group.warm.value || delay <= 0) {
    show(false)
    return
  }
  pending = setTimeout(() => show(true), delay)
}

function stopPointing(): void {
  pointing.value = false
  cancelPending()
  if (!focused) hide()
}

/** `:focus-visible` where the browser knows it; any focus counts where it does not. */
function focusLooksKeyboardDriven(element: HTMLElement): boolean {
  try {
    return element.matches(':focus-visible')
  } catch {
    return true
  }
}

function endPress(): void {
  pressing = false
  document.removeEventListener('pointerup', endPress)
  document.removeEventListener('pointercancel', endPress)
}

const triggerListeners: TooltipTriggerListeners = {
  pointerenter(event) {
    // Touch has no hover. A long-press is the platform's business.
    if (event.pointerType === 'touch') return
    startPointing()
  },
  pointerleave(event) {
    if (event.pointerType === 'touch') return
    // An open, hoverable bubble is left to the hover area below to close, so
    // the pointer can cross to it.
    if (open.value && group.hoverableContent.value) return
    stopPointing()
  },
  pointerdown() {
    pressing = true
    document.addEventListener('pointerup', endPress)
    document.addEventListener('pointercancel', endPress)
  },
  click() {
    if (group.closesOnActivate.value) hide()
  },
  focus() {
    const element = triggerElement.value
    if (pressing || disabled.value) return
    if (group.keyboardFocusOnly.value && element && !focusLooksKeyboardDriven(element)) return
    focused = true
    // No delay: someone who tabbed here has already chosen this control.
    show(false)
  },
  blur() {
    focused = false
    if (!pointing.value) hide()
  },
}

/**
 * Whether a point is still "on" the tooltip: inside the smallest box that
 * holds both the trigger and the bubble. One rectangle rather than the two
 * elements, so the gap between them — and the corners beside a bubble wider
 * than its trigger — can be crossed without the tooltip closing under the
 * pointer (WCAG 1.4.13, hoverable).
 */
function withinHoverArea(x: number, y: number): boolean {
  const rects = [triggerElement.value, bubbleElement.value]
    .filter((element): element is HTMLElement => element !== undefined)
    .map((element) => element.getBoundingClientRect())
  if (rects.length === 0) return false
  const left = Math.min(...rects.map((rect) => rect.left))
  const right = Math.max(...rects.map((rect) => rect.right))
  const top = Math.min(...rects.map((rect) => rect.top))
  const bottom = Math.max(...rects.map((rect) => rect.bottom))
  return x >= left && x <= right && y >= top && y <= bottom
}

// While a hover holds the tooltip open, follow the pointer across the page so
// leaving the hover area — or the window — ends the hover.
watch(
  () => open.value && pointing.value && group.hoverableContent.value,
  (following, _, onCleanup) => {
    if (!following || !isClient) return
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      if (!withinHoverArea(event.clientX, event.clientY)) stopPointing()
    }
    const onOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) stopPointing()
    }
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerout', onOut)
    onCleanup(() => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onOut)
    })
  }
)

// The bubble is fixed to the viewport, so scrolling whatever holds the trigger
// would leave it floating over the wrong thing. It closes instead.
watch(open, (isOpen, _, onCleanup) => {
  if (!isOpen || !isClient) return
  const onScroll = (event: Event) => {
    const trigger = triggerElement.value
    if (trigger && event.target instanceof Node && event.target.contains(trigger)) hide()
  }
  window.addEventListener('scroll', onScroll, { capture: true, passive: true })
  onCleanup(() => {
    window.removeEventListener('scroll', onScroll, { capture: true })
  })
})

watch(disabled, (isDisabled) => {
  if (isDisabled) hide()
})

onBeforeUnmount(() => {
  hide()
  if (isClient) endPress()
})

provide(tooltipKey, {
  contentId: useId(),
  open,
  state: computed<TooltipState>(() => {
    if (!open.value) return 'closed'
    return waited.value ? 'delayed-open' : 'instant-open'
  }),
  triggerElement,
  bubbleElement,
  triggerListeners,
  dismiss: hide,
})
</script>

<template>
  <slot />
</template>
