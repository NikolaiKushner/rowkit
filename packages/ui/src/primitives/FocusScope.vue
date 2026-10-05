<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch, type ComponentPublicInstance } from 'vue'
import { getActiveElement, unrefElement } from './dom'
import { enterTrap, moveFocus, tabbables } from './focus'
import { Primitive } from './Primitive'

/**
 * Keeps keyboard focus with a piece of UI for as long as it is open.
 *
 * - On mount, focus moves to the first thing Tab can reach inside, or to the
 *   scope itself when there is nothing.
 * - `trapped`: focus that leaves — by Tab, by a click outside, by script — is
 *   brought back to where it last was inside.
 * - `loop`: Tab past the last stop wraps to the first, Shift+Tab back.
 * - On unmount, focus goes back to whatever had it before the scope opened.
 *
 * The scope renders no element of its own; it lends `tabindex="-1"` and its
 * Tab handling to the single child.
 */
const props = withDefaults(
  defineProps<{
    /** Tab from the last element wraps to the first, and Shift+Tab back. */
    loop?: boolean
    /** Focus cannot leave by keyboard, pointer or script while trapped. */
    trapped?: boolean
  }>(),
  { loop: false, trapped: false }
)

const emit = defineEmits<{
  /** Fired before focus moves in on mount. Cancel to place focus yourself. */
  mountAutoFocus: [event: Event]
  /** Fired before focus returns on unmount. Cancel to place focus yourself. */
  unmountAutoFocus: [event: Event]
}>()

const root = ref<ComponentPublicInstance>()
const scope = (): HTMLElement | undefined => unrefElement(root.value)

/** Where focus was before the scope opened; it goes back there on close. */
let previous: HTMLElement | undefined
/** The last element inside that had focus; a trap pulls focus back to it. */
let lastInside: HTMLElement | undefined

function contains(node: EventTarget | null): node is HTMLElement {
  return node instanceof HTMLElement && (scope()?.contains(node) ?? false)
}

let trap: ReturnType<typeof enterTrap> | undefined
let observer: MutationObserver | undefined

function onFocusIn(event: FocusEvent): void {
  if (contains(event.target)) {
    lastInside = event.target
    return
  }
  if (!trap?.innermost()) return
  if (!moveFocus(lastInside)) moveFocus(scope())
}

/** The focused element was removed from inside: keep focus in the scope. */
function onMutation(): void {
  if (!trap?.innermost()) return
  const active = getActiveElement()
  if (active === null || active === document.body) moveFocus(scope())
}

function startTrap(): void {
  const element = scope()
  if (trap || !element) return
  trap = enterTrap()
  document.addEventListener('focusin', onFocusIn)
  observer = new MutationObserver(onMutation)
  observer.observe(element, { childList: true, subtree: true })
}

function stopTrap(): void {
  if (!trap) return
  trap.leave()
  trap = undefined
  document.removeEventListener('focusin', onFocusIn)
  observer?.disconnect()
  observer = undefined
}

let mounted = false

onMounted(() => {
  mounted = true
  const element = scope()
  if (!element) return
  const active = getActiveElement()
  if (active instanceof HTMLElement) previous = active
  if (props.trapped) startTrap()

  // Once everything opening with the scope has rendered and run its own
  // post-render work — which may still want to know where focus was.
  void nextTick(() => {
    if (!mounted || element.contains(getActiveElement())) return
    const event = new CustomEvent('rowkit.focusScope.mount', { cancelable: true })
    emit('mountAutoFocus', event)
    if (event.defaultPrevented) return
    if (!moveFocus(tabbables(element)[0], { select: true })) moveFocus(element)
  })
})

watch(
  () => props.trapped,
  (trapped) => (trapped ? startTrap() : stopTrap())
)

/*
 * Before unmounting, not after: Vue drops events emitted by an unmounted
 * component, and the handler must still be able to cancel and place focus.
 */
onBeforeUnmount(() => {
  mounted = false
  stopTrap()
  const event = new CustomEvent('rowkit.focusScope.unmount', { cancelable: true })
  emit('unmountAutoFocus', event)
  if (event.defaultPrevented) return
  // Only when focus is about to go down with the scope; never steal it from elsewhere.
  const active = getActiveElement()
  if (active === null || active === document.body || scope()?.contains(active)) moveFocus(previous)
})

function onKeyDown(event: KeyboardEvent): void {
  if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return
  // A nested scope already handled it.
  if (event.defaultPrevented || (!props.loop && !props.trapped)) return
  const element = scope()
  if (!element) return

  const stops = tabbables(element)
  if (stops.length === 0) {
    if (props.trapped) event.preventDefault()
    return
  }

  const active = getActiveElement()
  const first = stops[0]
  const last = stops[stops.length - 1]
  const leaving = event.shiftKey ? active === first || active === element : active === last
  if (!leaving) return

  if (props.loop) {
    event.preventDefault()
    moveFocus(event.shiftKey ? last : first, { select: true })
  } else if (props.trapped) {
    event.preventDefault()
  }
}
</script>

<template>
  <Primitive ref="root" as-child tabindex="-1" @keydown="onKeyDown">
    <slot />
  </Primitive>
</template>
