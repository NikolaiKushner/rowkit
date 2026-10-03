<!--
  Adapted from Reka UI's FocusScope (MIT).
  Copyright (c) 2023 UnoVue <https://github.com/unovue>
-->
<script lang="ts">
import { ref as vueRef } from 'vue'

interface Scope {
  paused: boolean
}

/**
 * Open scopes, newest first. Opening a scope pauses the one below it, so a
 * Select inside a Dialog can take focus without the Dialog's trap pulling it
 * back.
 */
const stack = vueRef<Scope[]>([])

function addScope(scope: Scope): void {
  const active = stack.value[0]
  if (active && active !== scope) active.paused = true
  stack.value = [scope, ...stack.value.filter((s) => s !== scope)]
}

function removeScope(scope: Scope): void {
  stack.value = stack.value.filter((s) => s !== scope)
  const next = stack.value[0]
  if (next) next.paused = false
}
</script>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watchEffect } from 'vue'
import {
  focus,
  focusFirst,
  getActiveElement,
  getTabbableCandidates,
  getTabbableEdges,
  isClient,
  unrefElement,
} from './dom'
import { Primitive } from './Primitive'

/**
 * Moves focus into its child on mount, optionally keeps it there, and returns
 * it to where it came from on unmount.
 *
 * Renders no element of its own: its `tabindex` and key handling land on the
 * single child, the way Reka's `as-child` FocusScope does.
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

const root = ref<InstanceType<typeof Primitive> | null>(null)
const container = computed(() => unrefElement(root.value))
const lastFocused = ref<HTMLElement | null>(null)
const scope = reactive<Scope>({ paused: false })

const MOUNT = 'focusScope.autoFocusOnMount'
const UNMOUNT = 'focusScope.autoFocusOnUnmount'
const EVENT_OPTIONS = { bubbles: false, cancelable: true }

/* Trap ---------------------------------------------------------------------- */

watchEffect((onCleanup) => {
  if (!isClient || !props.trapped) return
  const el = container.value
  if (!el) return

  const onFocusIn = (event: FocusEvent) => {
    if (scope.paused) return
    const target = event.target as HTMLElement | null
    if (el.contains(target)) lastFocused.value = target
    else focus(lastFocused.value, { select: true })
  }

  /*
   * A null relatedTarget means the window lost focus, or Chrome removed the
   * focused node. Leave both alone: the browser restores focus itself, and
   * refocusing a removed node in Chrome spins the CPU.
   */
  const onFocusOut = (event: FocusEvent) => {
    if (scope.paused) return
    const next = event.relatedTarget as HTMLElement | null
    if (next !== null && !el.contains(next)) focus(lastFocused.value, { select: true })
  }

  /* When the focused element is removed, browsers drop focus to <body>. */
  const observer = new MutationObserver((mutations) => {
    const last = lastFocused.value
    if (!last || !mutations.some((m) => m.removedNodes.length > 0)) return
    if (!el.contains(last)) focus(el)
  })

  document.addEventListener('focusin', onFocusIn)
  document.addEventListener('focusout', onFocusOut)
  observer.observe(el, { childList: true, subtree: true })
  onCleanup(() => {
    document.removeEventListener('focusin', onFocusIn)
    document.removeEventListener('focusout', onFocusOut)
    observer.disconnect()
  })
})

/* Auto-focus on mount, restore on unmount ---------------------------------- */

watchEffect((onCleanup) => {
  const el = container.value
  if (!el) return
  let restore: (() => void) | undefined
  let cancelled = false

  // A tick late, so the content has rendered and has something to focus.
  void nextTick().then(() => {
    if (cancelled) return
    addScope(scope)
    const previous = getActiveElement() as HTMLElement | null

    if (!el.contains(previous)) {
      const event = new CustomEvent(MOUNT, EVENT_OPTIONS)
      const handler = (e: Event) => emit('mountAutoFocus', e)
      el.addEventListener(MOUNT, handler)
      el.dispatchEvent(event)
      el.removeEventListener(MOUNT, handler)
      if (!event.defaultPrevented) {
        focusFirst(getTabbableCandidates(el), { select: true })
        if (getActiveElement() === previous) focus(el)
      }
    }

    restore = () => {
      const event = new CustomEvent(UNMOUNT, EVENT_OPTIONS)
      const handler = (e: Event) => emit('unmountAutoFocus', e)
      el.addEventListener(UNMOUNT, handler)
      el.dispatchEvent(event)
      el.setAttribute('data-focus-scope-unmounting', '')
      setTimeout(() => {
        if (!event.defaultPrevented) focus(previous ?? document.body, { select: true })
        el.removeEventListener(UNMOUNT, handler)
        removeScope(scope)
        el.removeAttribute('data-focus-scope-unmounting')
      }, 0)
    }
  })

  onCleanup(() => {
    cancelled = true
    restore?.()
  })
})

/* Tab looping ---------------------------------------------------------------- */

function onKeyDown(event: KeyboardEvent): void {
  if ((!props.loop && !props.trapped) || scope.paused) return
  const isTab = event.key === 'Tab' && !event.altKey && !event.ctrlKey && !event.metaKey
  const focused = getActiveElement() as HTMLElement | null
  if (!isTab || !focused) return

  const el = event.currentTarget as HTMLElement
  const [first, last] = getTabbableEdges(el)
  if (!first || !last) {
    if (focused === el) event.preventDefault()
    return
  }
  if (!event.shiftKey && focused === last) {
    event.preventDefault()
    if (props.loop) focus(first, { select: true })
  } else if (event.shiftKey && focused === first) {
    event.preventDefault()
    if (props.loop) focus(last, { select: true })
  }
}
</script>

<template>
  <Primitive ref="root" as-child tabindex="-1" @keydown="onKeyDown">
    <slot />
  </Primitive>
</template>
