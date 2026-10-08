<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type ComponentPublicInstance,
} from 'vue'
import { useToast, type ToastItem } from '../../composables/useToast'
import CloseGlyphIcon from '../../icons/CloseGlyphIcon.vue'
import ErrorIcon from '../../icons/ErrorIcon.vue'
import InfoIcon from '../../icons/InfoIcon.vue'
import SuccessIcon from '../../icons/SuccessIcon.vue'
import WarningIcon from '../../icons/WarningIcon.vue'
import { getActiveElement, unrefElement } from '../../primitives/dom'
import { moveFocus } from '../../primitives/focus'
import { cn } from '../../utils/cn'
import Button from '../Button/Button.vue'
import {
  toastActionVariants,
  toastBodyVariants,
  toastTitleVariants,
  toastCloseVariants,
  toastIconVariants,
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

/** The key that moves focus into the stack. Named in the region's label. */
const HOTKEY = 'F8'

/** Travel, in pixels, before a press on a toast becomes a drag rather than a click. */
const DRAG_THRESHOLD = 8

/** Travel, in pixels, past which letting go of a dragged toast dismisses it. */
const SWIPE_DISMISS = 50

// The queue limit belongs to whatever renders the queue.
watch(
  () => props.max,
  (max) => setMax(max),
  { immediate: true }
)

/**
 * Teleporting needs a `document`, and rendering the region on the server would
 * only produce a hydration mismatch, so it appears once mounted. It is there
 * before any toast is, because a live region created together with its
 * content is often not announced.
 */
const mounted = ref(false)
const stack = ref<HTMLOListElement>()

/*
 * What is on screen
 *
 * The queue removes a toast the moment it is dismissed, which frees its slot
 * for the next one at once. The stack keeps it a little longer, marked closed,
 * so its exit animation can play. Newest first: the toast that just arrived is
 * where Tab and a screen reader's reading order start.
 */

interface Shown {
  item: ToastItem
  /** Dismissed, and playing its exit before it leaves the DOM. */
  closing: boolean
}

const shown = shallowRef<Shown[]>([])
const elements = new Map<string, HTMLElement>()

function track(id: string, el: Element | ComponentPublicInstance | null): void {
  const element = unrefElement(el)
  if (element) elements.set(id, element)
  else elements.delete(id)
}

/**
 * Brings the stack in line with the queue. Runs before the DOM updates, so a
 * toast on its way out is still focusable here and focus can be handed to the
 * stack before the toast turns inert.
 */
function reconcile(queue: readonly ToastItem[]): void {
  const inQueue = new Set(queue.map((item) => item.id))
  const onScreen = new Set(shown.value.map((entry) => entry.item.id))

  const arriving = queue.filter((item) => !onScreen.has(item.id))
  const leaving = shown.value
    .filter((entry) => !entry.closing && !inQueue.has(entry.item.id))
    .map((entry) => entry.item.id)

  for (const id of leaving) {
    keepFocusInStack(id)
    stopClock(id)
  }

  // The queue lists oldest first; the stack wants the newest on top.
  shown.value = [
    ...[...arriving].reverse().map((item) => ({ item, closing: false })),
    ...shown.value.map((entry) =>
      leaving.includes(entry.item.id) ? { item: entry.item, closing: true } : entry
    ),
  ]

  for (const item of arriving) startClock(item)
  announce(arriving)
  if (leaving.length > 0) void nextTick(() => leaving.forEach(removeAfterExit))
}

/**
 * Takes a closed toast out of the DOM once its exit animation has run. With
 * no animation — reduced motion, or no layout engine at all — it goes now.
 */
function removeAfterExit(id: string): void {
  const element = elements.get(id)
  const running =
    element && typeof element.getAnimations === 'function'
      ? element
          .getAnimations()
          .filter(
            (animation) =>
              animation.playState !== 'finished' &&
              animation.effect?.getComputedTiming().endTime !== Infinity
          )
      : []
  const drop = () => {
    shown.value = shown.value.filter((entry) => entry.item.id !== id)
  }
  if (running.length === 0) drop()
  // A cancelled animation rejects `finished`; the toast is done either way.
  else void Promise.allSettled(running.map((animation) => animation.finished)).then(drop)
}

/**
 * A toast that closes while it holds focus would drop focus onto `<body>`,
 * losing the user's place. Focus goes to the stack instead, one Tab away from
 * the next toast.
 */
function keepFocusInStack(id: string): void {
  const element = elements.get(id)
  const active = getActiveElement()
  if (element && active && element.contains(active)) moveFocus(stack.value)
}

/*
 * Countdown
 *
 * Each toast on screen runs its own clock, and a queued toast has none, so
 * nothing can expire before it is seen. A clock stops while anything holds the
 * toast: the pointer over it, focus inside it, a drag in progress. Holding one
 * toast leaves the others counting, or a resting mouse would pin the whole
 * stack in place. Leaving the window stops every clock: nobody is reading.
 */

type Hold = 'pointer' | 'focus' | 'drag'

interface Clock {
  /** Milliseconds still to run. */
  remaining: number
  /** When the current run began, or `undefined` while stopped. */
  runningSince: number | undefined
  timeout: number | undefined
}

const clocks = new Map<string, Clock>()
const holds = new Map<string, Set<Hold>>()
let windowAway = false

function startClock(item: ToastItem): void {
  // `0` means the toast waits for the user, however long that takes.
  if (!(item.duration > 0) || !Number.isFinite(item.duration)) return
  clocks.set(item.id, { remaining: item.duration, runningSince: undefined, timeout: undefined })
  updateClock(item.id)
}

function stopClock(id: string): void {
  window.clearTimeout(clocks.get(id)?.timeout)
  clocks.delete(id)
  holds.delete(id)
}

/** Starts or stops a toast's clock to match whether anything is holding it. */
function updateClock(id: string): void {
  const clock = clocks.get(id)
  if (!clock) return
  const held = windowAway || (holds.get(id)?.size ?? 0) > 0
  const now = performance.now()

  if (held && clock.runningSince !== undefined) {
    window.clearTimeout(clock.timeout)
    clock.remaining = Math.max(0, clock.remaining - (now - clock.runningSince))
    clock.runningSince = undefined
    clock.timeout = undefined
  } else if (!held && clock.runningSince === undefined) {
    clock.runningSince = now
    clock.timeout = window.setTimeout(() => dismiss(id), clock.remaining)
  }
}

function hold(id: string, reason: Hold): void {
  const reasons = holds.get(id) ?? new Set<Hold>()
  reasons.add(reason)
  holds.set(id, reasons)
  updateClock(id)
}

function release(id: string, reason: Hold): void {
  holds.get(id)?.delete(reason)
  updateClock(id)
}

function onWindowBlur(): void {
  windowAway = true
  clocks.forEach((_, id) => updateClock(id))
}

function onWindowFocus(): void {
  windowAway = false
  clocks.forEach((_, id) => updateClock(id))
}

function onFocusOut(id: string, event: FocusEvent): void {
  // Tabbing from the message to the action button is still focus on the toast.
  const next = event.relatedTarget
  const element = event.currentTarget
  if (element instanceof Node && next instanceof Node && element.contains(next)) return
  release(id, 'focus')
}

/*
 * Announcing
 *
 * One status region, there from the start, carries every toast to a screen
 * reader politely: danger included, since interrupting the reader mid-sentence
 * costs more than hearing "could not save" a moment later. The region is
 * emptied first and written a frame later, so a message identical to the last
 * one is still a change and is still read.
 */

const announcement = ref('')
let pendingAnnouncements: string[] = []
let cancelAnnouncement: (() => void) | undefined

function afterFrame(callback: () => void): () => void {
  if (typeof window.requestAnimationFrame === 'function') {
    const frame = window.requestAnimationFrame(callback)
    return () => window.cancelAnimationFrame(frame)
  }
  const timeout = window.setTimeout(callback, 16)
  return () => window.clearTimeout(timeout)
}

function announce(items: readonly ToastItem[]): void {
  if (items.length === 0) return
  // Toasts arriving together are read together, rather than the last one
  // overwriting the rest before the reader gets to them.
  pendingAnnouncements.push(
    ...items.map((item) =>
      item.title === undefined
        ? `${props.label}: ${item.message}`
        : `${props.label}: ${item.title}. ${item.message}`
    )
  )
  announcement.value = ''
  cancelAnnouncement?.()
  cancelAnnouncement = afterFrame(() => {
    announcement.value = pendingAnnouncements.join('\n')
    pendingAnnouncements = []
    cancelAnnouncement = undefined
  })
}

function onWindowKeydown(event: KeyboardEvent): void {
  if (event.key !== HOTKEY || event.defaultPrevented) return
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
  if (!shown.value.some((entry) => !entry.closing)) return
  event.preventDefault()
  moveFocus(stack.value)
}

/**
 * Escape closes the toast that holds focus and stops there. Left to bubble, it
 * would reach the window and close the dialog underneath as well, and one
 * press should close one thing.
 */
function onToastKeydown(id: string, event: KeyboardEvent): void {
  if (event.key !== 'Escape' || event.isComposing || event.defaultPrevented) return
  event.preventDefault()
  event.stopPropagation()
  dismiss(id)
}

/*
 * Swipe to dismiss
 *
 * A toast follows the pointer rightwards, toward the edge it is anchored to,
 * and goes if released far enough along. A drag only starts after a few pixels
 * of mostly horizontal travel, so an ordinary click on the action or the close
 * button is never mistaken for one. Once dragging, the pointer is captured: the
 * release lands on the toast, and no button underneath it receives a click.
 */

interface Drag {
  id: string
  pointerId: number
  startX: number
  startY: number
  dragging: boolean
}

let drag: Drag | undefined

function onPointerDown(id: string, event: PointerEvent): void {
  if (!event.isPrimary || event.button !== 0) return
  drag = {
    id,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    dragging: false,
  }
}

function onPointerMove(event: PointerEvent): void {
  const element = event.currentTarget
  if (!drag || event.pointerId !== drag.pointerId || !(element instanceof HTMLElement)) return
  const dx = event.clientX - drag.startX
  const dy = event.clientY - drag.startY

  if (!drag.dragging) {
    if (Math.abs(dy) > DRAG_THRESHOLD && Math.abs(dy) >= Math.abs(dx)) {
      drag = undefined
      return
    }
    if (dx < DRAG_THRESHOLD) return
    drag.dragging = true
    element.setPointerCapture(event.pointerId)
    element.dataset.swipe = 'move'
    hold(drag.id, 'drag')
  }
  element.style.setProperty('--rk-toast-swipe-x', `${String(Math.max(0, dx))}px`)
}

function onPointerUp(event: PointerEvent): void {
  finishDrag(event, true)
}

function onPointerCancel(event: PointerEvent): void {
  finishDrag(event, false)
}

function finishDrag(event: PointerEvent, released: boolean): void {
  const element = event.currentTarget
  if (!drag || event.pointerId !== drag.pointerId) return
  const { id, dragging, startX } = drag
  drag = undefined
  if (!dragging || !(element instanceof HTMLElement)) return

  if (released && event.clientX - startX >= SWIPE_DISMISS) {
    // Left at its offset, so it fades out from where it was let go.
    dismiss(id)
    return
  }
  element.dataset.swipe = 'cancel'
  element.style.removeProperty('--rk-toast-swipe-x')
  release(id, 'drag')
}

function runAction(item: ToastItem): void {
  item.action?.onClick()
  // Acting on a toast is answering it; it has nothing left to say.
  dismiss(item.id)
}

let stopReconciling: (() => void) | undefined

onMounted(() => {
  mounted.value = true
  // Toasts fired before the Toaster mounted are picked up here, and only now
  // start counting down.
  stopReconciling = watch(visible, reconcile, { immediate: true })
  window.addEventListener('keydown', onWindowKeydown)
  window.addEventListener('blur', onWindowBlur)
  window.addEventListener('focus', onWindowFocus)
})

onBeforeUnmount(() => {
  stopReconciling?.()
  window.removeEventListener('keydown', onWindowKeydown)
  window.removeEventListener('blur', onWindowBlur)
  window.removeEventListener('focus', onWindowFocus)
  clocks.forEach((clock) => window.clearTimeout(clock.timeout))
  clocks.clear()
  holds.clear()
  cancelAnnouncement?.()
})
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
      :style="shown.length > 0 ? undefined : { pointerEvents: 'none' }"
    >
      <div class="sr-only" role="status" aria-live="polite">{{ announcement }}</div>

      <ol
        ref="stack"
        data-slot="toaster"
        tabindex="-1"
        :class="cn(toasterViewportVariants({ position: props.position }), props.class)"
      >
        <li
          v-for="{ item, closing } in shown"
          :key="item.id"
          :ref="(el) => track(item.id, el)"
          :data-toast-id="item.id"
          data-slot="toast"
          :data-state="closing ? 'closed' : 'open'"
          data-swipe-direction="right"
          tabindex="0"
          :inert="closing"
          :data-variant="item.variant"
          :class="toastVariants()"
          style="user-select: none; touch-action: none"
          @pointerenter="hold(item.id, 'pointer')"
          @pointerleave="release(item.id, 'pointer')"
          @focusin="hold(item.id, 'focus')"
          @focusout="onFocusOut(item.id, $event)"
          @keydown="onToastKeydown(item.id, $event)"
          @pointerdown="onPointerDown(item.id, $event)"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerCancel"
        >
          <!-- The face is the same for every variant; the icon carries the status. -->
          <SuccessIcon
            v-if="item.variant === 'success'"
            data-slot="toast-icon"
            :class="toastIconVariants()"
          />
          <WarningIcon
            v-else-if="item.variant === 'warning'"
            data-slot="toast-icon"
            :class="toastIconVariants()"
          />
          <ErrorIcon
            v-else-if="item.variant === 'danger'"
            data-slot="toast-icon"
            :class="toastIconVariants()"
          />
          <InfoIcon v-else data-slot="toast-icon" :class="toastIconVariants()" />

          <div :class="toastBodyVariants()">
            <span v-if="item.title" data-slot="toast-title" :class="toastTitleVariants()">
              {{ item.title }}
            </span>
            <span :class="toastMessageVariants({ underTitle: Boolean(item.title) })">{{
              item.message
            }}</span>
            <div v-if="item.action" :class="toastActionVariants()">
              <Button variant="secondary" size="sm" @click="runAction(item)">
                {{ item.action.label }}
              </Button>
            </div>
          </div>

          <button
            type="button"
            :aria-label="props.closeLabel"
            :class="toastCloseVariants()"
            @click="dismiss(item.id)"
          >
            <CloseGlyphIcon />
          </button>
        </li>
      </ol>
    </div>
  </Teleport>
</template>
