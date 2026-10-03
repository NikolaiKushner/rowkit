<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { useToast, type ToastItem } from '../../composables/useToast'
import { getActiveElement, isClient } from '../../primitives/dom'
import { cn } from '../../utils/cn'
import {
  toastActionVariants,
  toastCloseVariants,
  toasterViewportVariants,
  toastMessageVariants,
  toastVariants,
} from './Toaster.variants'
import type { ToasterProps } from './types'

defineOptions({ name: 'RkToaster' })

const props = withDefaults(defineProps<ToasterProps>(), {
  position: 'bottom-right',
  max: 3,
  label: 'Notification',
  closeLabel: 'Dismiss',
})

const { visible, dismiss, setMax } = useToast()

watch(() => props.max, setMax, { immediate: true })

const HOTKEY = 'F8'
const SWIPE_THRESHOLD = 50

const viewport = ref<HTMLOListElement>()
const hasToasts = computed(() => visible.value.length > 0)

/**
 * Newest first in the DOM, so Tab and a screen reader's reading order both
 * start at the toast that just arrived. The variants flip the flex direction
 * to keep the visual stacking the position asks for.
 *
 * The alternative — DOM oldest-first with Tab reversed by hand — needs hidden
 * focusable proxies at both ends, which is exactly what axe's
 * `aria-hidden-focus` rule forbids. Ordering the DOM needs none of it.
 */
const newestFirst = computed(() => [...visible.value].reverse())

/*
 * Teleport only after mount, so the server render and the first client render
 * agree. The region itself stays mounted whether or not anything is queued: a
 * live region added at the same moment as its content is often not announced.
 */
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

/* -------------------------------------------------------------------------- */
/* Countdown                                                                   */
/* -------------------------------------------------------------------------- */

interface Countdown {
  remaining: number
  startedAt: number
  timer: number | undefined
}

/** One countdown per visible toast. A queued toast has none until it shows. */
const countdowns = new Map<string, Countdown>()
/** Hovering or focusing the stack pauses every countdown in it. */
const paused = ref(false)

function start(id: string, countdown: Countdown): void {
  if (countdown.remaining <= 0 || !Number.isFinite(countdown.remaining)) return
  window.clearTimeout(countdown.timer)
  countdown.startedAt = Date.now()
  countdown.timer = window.setTimeout(() => close(id), countdown.remaining)
}

function stop(countdown: Countdown): void {
  window.clearTimeout(countdown.timer)
  countdown.timer = undefined
  countdown.remaining -= Date.now() - countdown.startedAt
}

watch(
  visible,
  (items) => {
    if (!isClient) return
    const ids = new Set(items.map((item) => item.id))
    for (const [id, countdown] of countdowns) {
      if (!ids.has(id)) {
        window.clearTimeout(countdown.timer)
        countdowns.delete(id)
      }
    }
    for (const item of items) {
      if (countdowns.has(item.id)) continue
      // `0` in the public API means "stays until dismissed".
      const countdown: Countdown = {
        remaining: item.duration === 0 ? Infinity : item.duration,
        startedAt: Date.now(),
        timer: undefined,
      }
      countdowns.set(item.id, countdown)
      if (!paused.value) start(item.id, countdown)
    }
  },
  { immediate: true }
)

watch(paused, (isPaused) => {
  for (const [id, countdown] of countdowns) {
    if (isPaused) stop(countdown)
    else start(id, countdown)
  }
})

onBeforeUnmount(() => {
  for (const countdown of countdowns.values()) window.clearTimeout(countdown.timer)
})

watchEffect((onCleanup) => {
  const el = viewport.value
  if (!el || !hasToasts.value) return
  const pause = () => {
    paused.value = true
  }
  const resume = () => {
    paused.value = false
  }
  const onFocusOut = (event: FocusEvent) => {
    if (!el.contains(event.relatedTarget as Node | null)) resume()
  }
  const onPointerLeave = () => {
    if (!el.contains(getActiveElement())) resume()
  }
  el.addEventListener('focusin', pause)
  el.addEventListener('focusout', onFocusOut)
  el.addEventListener('pointermove', pause)
  el.addEventListener('pointerleave', onPointerLeave)
  // A toast should not expire while the user is in another window.
  window.addEventListener('blur', pause)
  window.addEventListener('focus', resume)
  onCleanup(() => {
    el.removeEventListener('focusin', pause)
    el.removeEventListener('focusout', onFocusOut)
    el.removeEventListener('pointermove', pause)
    el.removeEventListener('pointerleave', onPointerLeave)
    window.removeEventListener('blur', pause)
    window.removeEventListener('focus', resume)
  })
})

/* -------------------------------------------------------------------------- */
/* Closing                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Removes the toast. When it held keyboard focus, focus moves to the stack
 * instead of falling to <body>, so a screen reader user hears where they are
 * and can carry on to the next toast.
 */
function close(id: string, byKeyboard = false): void {
  const el = viewport.value?.querySelector(`[data-toast-id="${id}"]`)
  if (byKeyboard && el?.contains(getActiveElement())) viewport.value?.focus()
  if (byKeyboard) paused.value = false
  dismiss(id)
}

/** A keyboard-activated click has `detail === 0`; a pointer click does not. */
function onClose(item: ToastItem, event: MouseEvent): void {
  close(item.id, event.detail === 0)
}

function onAction(item: ToastItem, event: MouseEvent): void {
  item.action?.onClick()
  onClose(item, event)
}

/* -------------------------------------------------------------------------- */
/* Keyboard                                                                    */
/* -------------------------------------------------------------------------- */

/*
 * F8 jumps to the stack from anywhere, and Escape closes the toast that holds
 * focus — and only then. An Escape anywhere else belongs to what the user is
 * in, such as a dialog, and must not sweep the notifications away with it.
 */
watchEffect((onCleanup) => {
  if (!isClient) return
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === HOTKEY) {
      viewport.value?.focus()
      return
    }
    if (event.key !== 'Escape' || event.defaultPrevented) return
    const active = getActiveElement()
    const el = viewport.value
    if (!el || !(active instanceof HTMLElement) || !el.contains(active)) return
    const toast = active.closest<HTMLElement>('[data-toast-id]')
    const ids = toast ? [toast.dataset.toastId ?? ''] : visible.value.map((item) => item.id)
    for (const id of ids) close(id, true)
  }
  window.addEventListener('keydown', onKeyDown)
  onCleanup(() => window.removeEventListener('keydown', onKeyDown))
})

/* -------------------------------------------------------------------------- */
/* Swipe to dismiss                                                            */
/* -------------------------------------------------------------------------- */

let swipe: { id: string; startX: number; startY: number; dx: number | null } | null = null

function onPointerDown(item: ToastItem, event: PointerEvent): void {
  if (event.button !== 0) return
  swipe = { id: item.id, startX: event.clientX, startY: event.clientY, dx: null }
}

function onPointerMove(event: PointerEvent): void {
  if (!swipe) return
  const toast = event.currentTarget as HTMLElement
  const x = event.clientX - swipe.startX
  const y = event.clientY - swipe.startY
  const buffer = event.pointerType === 'touch' ? 10 : 2
  const dx = Math.max(0, x)
  if (swipe.dx === null) {
    if (dx > buffer && Math.abs(x) > Math.abs(y)) {
      ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
    } else {
      // Moving the wrong way — a scroll or a text selection, not a swipe.
      if (Math.abs(x) > buffer || Math.abs(y) > buffer) swipe = null
      return
    }
  }
  swipe.dx = dx
  toast.setAttribute('data-swipe', 'move')
  toast.style.setProperty('--rk-toast-swipe-x', `${String(dx)}px`)
}

function onPointerUp(event: PointerEvent): void {
  const target = event.target as HTMLElement
  if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId)
  const current = swipe
  swipe = null
  if (current?.dx == null) return

  const toast = event.currentTarget as HTMLElement
  toast.style.removeProperty('--rk-toast-swipe-x')
  // The pointer-up that ends a swipe must not also click a button inside.
  toast.addEventListener('click', (e) => e.preventDefault(), { once: true })
  if (current.dx > SWIPE_THRESHOLD) {
    close(current.id)
  } else {
    toast.setAttribute('data-swipe', 'cancel')
  }
}

/* -------------------------------------------------------------------------- */
/* Announcements                                                               */
/* -------------------------------------------------------------------------- */

/**
 * What the live region says.
 *
 * One persistent polite region, written a frame after a toast appears. A live
 * region inserted together with its text, one per toast, is frequently not
 * announced. Polite for every
 * tone, danger included: an assertive region interrupts whatever the reader is
 * saying, and "could not save" is not worth losing that.
 */
const announcement = ref('')
const announced = new Set<string>()
let clearTimer: number | undefined

watch(
  visible,
  (items) => {
    if (!isClient) return
    const fresh = items.filter((item) => !announced.has(item.id))
    for (const item of fresh) announced.add(item.id)
    for (const id of announced) if (!items.some((item) => item.id === id)) announced.delete(id)
    if (fresh.length === 0) return
    const text = fresh
      .map((item) => [props.label, item.message, item.action?.label].filter(Boolean).join(' '))
      .join('. ')
    // Two frames: NVDA misses text written in the same frame as the toast.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        announcement.value = text
        window.clearTimeout(clearTimer)
        clearTimer = window.setTimeout(() => (announcement.value = ''), 1000)
      })
    )
  },
  { immediate: true }
)

onBeforeUnmount(() => window.clearTimeout(clearTimer))
</script>

<template>
  <Teleport v-if="mounted" to="body">
    <!--
      A branch of every dismissable layer: clicking a toast while a dialog is
      open does not count as a click outside the dialog.
    -->
    <div
      role="region"
      :aria-label="`Notifications (${HOTKEY})`"
      tabindex="-1"
      data-dismissable-layer-branch
      :style="hasToasts ? undefined : { pointerEvents: 'none' }"
    >
      <div class="sr-only" role="status" aria-live="polite">{{ announcement }}</div>

      <ol
        ref="viewport"
        data-slot="toaster"
        tabindex="-1"
        :class="cn(toasterViewportVariants({ position: props.position }), props.class)"
      >
        <li
          v-for="item in newestFirst"
          :key="item.id"
          :data-toast-id="item.id"
          data-slot="toast"
          data-state="open"
          data-swipe-direction="right"
          tabindex="0"
          :class="toastVariants({ variant: item.variant })"
          style="user-select: none; touch-action: none"
          @pointerdown="onPointerDown(item, $event)"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
        >
          <span :class="toastMessageVariants()">{{ item.message }}</span>

          <button
            v-if="item.action"
            type="button"
            :class="toastActionVariants()"
            @click="onAction(item, $event)"
          >
            {{ item.action.label }}
          </button>

          <button
            type="button"
            :aria-label="props.closeLabel"
            :class="toastCloseVariants()"
            @click="onClose(item, $event)"
          >
            <svg class="size-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="m4 4 6 6M10 4l-6 6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </li>
      </ol>
    </div>
  </Teleport>
</template>
