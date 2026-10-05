<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import TriangleDownIcon from '../../icons/TriangleDownIcon.vue'
import TriangleLeftIcon from '../../icons/TriangleLeftIcon.vue'
import TriangleRightIcon from '../../icons/TriangleRightIcon.vue'
import TriangleUpIcon from '../../icons/TriangleUpIcon.vue'
import { cn } from '../../utils/cn'
import {
  scrollAreaButtonVariants,
  scrollAreaContentVariants,
  scrollAreaCornerVariants,
  scrollAreaFootVariants,
  scrollAreaMainVariants,
  scrollAreaScrollbarVariants,
  scrollAreaThumbVariants,
  scrollAreaTrackVariants,
  scrollAreaVariants,
  scrollAreaViewportVariants,
} from './ScrollArea.variants'
import type { ScrollAreaProps } from './types'

defineOptions({ name: 'RkScrollArea' })

const props = withDefaults(defineProps<ScrollAreaProps>(), {
  scrollbars: 'auto',
})

defineSlots<{
  /** The content that scrolls. */
  default?: () => unknown
}>()

/** An arrow button's length along the bar, and one arrow step. */
const BUTTON = 16
const LINE = 16
/** The shortest thumb Windows 98 draws. Below it, the track shows none. */
const MIN_THUMB = 8
/** Hold an arrow or the track: one step at once, then a step every 50ms after 500ms. */
const REPEAT_DELAY = 500
const REPEAT_INTERVAL = 50

type Axis = 'x' | 'y'

interface AxisState {
  /** The content is longer than the viewport on this axis. */
  overflow: boolean
  /** Thumb length and its offset from the start of the track, whole pixels. */
  thumb: number
  offset: number
}

const viewport = ref<HTMLElement>()
const content = ref<HTMLElement>()

const axes = reactive<Record<Axis, AxisState>>({
  x: { overflow: false, thumb: 0, offset: 0 },
  y: { overflow: false, thumb: 0, offset: 0 },
})

const showX = computed(() => props.scrollbars === 'always' || axes.x.overflow)
const showY = computed(() => props.scrollbars === 'always' || axes.y.overflow)
const scrollable = computed(() => axes.x.overflow || axes.y.overflow)

function metrics(el: HTMLElement, axis: Axis) {
  return axis === 'y'
    ? { client: el.clientHeight, size: el.scrollHeight, position: el.scrollTop }
    : { client: el.clientWidth, size: el.scrollWidth, position: el.scrollLeft }
}

function setPosition(axis: Axis, value: number): void {
  const el = viewport.value
  if (!el) return
  if (axis === 'y') el.scrollTop = value
  else el.scrollLeft = value
}

/**
 * Thumb length is the visible share of the content; its offset, the share
 * scrolled past. Both rounded, so the thumb's bevel lands on whole pixels.
 */
function measure(): void {
  const el = viewport.value
  if (!el) return
  for (const axis of ['x', 'y'] as const) {
    const { client, size, position } = metrics(el, axis)
    const state = axes[axis]
    // A fraction of a pixel left over from zoom or rounding is not overflow.
    state.overflow = size - client > 1
    const track = client - 2 * BUTTON
    const thumb = Math.min(track, Math.max(MIN_THUMB, Math.round((track * client) / size)))
    if (!state.overflow || track < MIN_THUMB) {
      state.thumb = 0
      state.offset = 0
      continue
    }
    state.thumb = thumb
    state.offset = Math.round((track - thumb) * (position / (size - client)))
  }
}

let resizeObserver: ResizeObserver | undefined
let mutationObserver: MutationObserver | undefined

onMounted(() => {
  measure()
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(measure)
    // The box can change size, and so can what is inside it.
    if (viewport.value) resizeObserver.observe(viewport.value)
    if (content.value) resizeObserver.observe(content.value)
  }
  if (typeof MutationObserver !== 'undefined' && content.value) {
    // Content added deep inside can overflow sideways without resizing the
    // wrapper the size observer watches.
    mutationObserver = new MutationObserver(measure)
    mutationObserver.observe(content.value, { childList: true, subtree: true, characterData: true })
  }
})

/*
 * Holding a part of a bar. Every press captures the pointer, so the moves and
 * the release come back to the part that was pressed even when the pointer
 * leaves it — and, for an arrow, leaving it lets the arrow up and pauses the
 * repeat until the pointer comes back, as Windows 98 does.
 */
type Hold =
  | { kind: 'arrow'; axis: Axis; direction: 1 | -1; inside: boolean }
  | { kind: 'track'; axis: Axis; direction: 1 | -1; pointer: number }
  | { kind: 'thumb'; axis: Axis; startPointer: number; startPosition: number }

const hold = ref<Hold>()
let timer: ReturnType<typeof setTimeout> | undefined

function repeat(step: () => void): void {
  step()
  const tick = (): void => {
    step()
    timer = setTimeout(tick, REPEAT_INTERVAL)
  }
  timer = setTimeout(tick, REPEAT_DELAY)
}

function release(): void {
  if (timer !== undefined) clearTimeout(timer)
  timer = undefined
  hold.value = undefined
}

onBeforeUnmount(() => {
  release()
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
})

/** The pointer's position along the axis, from the start of an element. */
function along(event: PointerEvent, el: Element, axis: Axis): number {
  const box = el.getBoundingClientRect()
  return axis === 'y' ? event.clientY - box.top : event.clientX - box.left
}

/**
 * Starts a hold. The press is the bar's alone: it neither moves focus off
 * whatever has it nor starts a text selection.
 */
function grab(event: PointerEvent, axis: Axis): HTMLElement | undefined {
  if (event.button !== 0 || !axes[axis].overflow) return undefined
  event.preventDefault()
  const el = event.currentTarget as HTMLElement
  // Throws for a pointer the browser does not know — a synthetic event. The
  // hold still works; moves just arrive only while over the part.
  try {
    el.setPointerCapture(event.pointerId)
  } catch {
    /* no live pointer to capture */
  }
  return el
}

function onArrowDown(event: PointerEvent, axis: Axis, direction: 1 | -1): void {
  if (!grab(event, axis)) return
  hold.value = { kind: 'arrow', axis, direction, inside: true }
  repeat(() => {
    const current = hold.value
    if (current?.kind !== 'arrow' || !current.inside) return
    const el = viewport.value
    if (el) setPosition(axis, metrics(el, axis).position + direction * LINE)
  })
}

function onTrackDown(event: PointerEvent, axis: Axis): void {
  // A press on the thumb is the thumb's.
  if (event.target !== event.currentTarget) return
  const track = grab(event, axis)
  if (!track) return
  const pointer = along(event, track, axis)
  const direction = pointer < axes[axis].offset ? -1 : 1
  hold.value = { kind: 'track', axis, direction, pointer }
  // A page at a time toward the pointer, until the thumb reaches it.
  repeat(() => {
    const current = hold.value
    const el = viewport.value
    if (current?.kind !== 'track' || !el) return
    const { offset, thumb } = axes[axis]
    if (direction < 0 ? current.pointer >= offset : current.pointer < offset + thumb) return
    const { client, position } = metrics(el, axis)
    setPosition(axis, position + direction * client)
    measure()
  })
}

function onThumbDown(event: PointerEvent, axis: Axis): void {
  const thumb = grab(event, axis)
  const el = viewport.value
  if (!thumb || !el) return
  hold.value = {
    kind: 'thumb',
    axis,
    startPointer: axis === 'y' ? event.clientY : event.clientX,
    startPosition: metrics(el, axis).position,
  }
}

function onPointerMove(event: PointerEvent): void {
  const current = hold.value
  const el = viewport.value
  if (!current || !el) return
  const target = event.currentTarget as HTMLElement
  if (current.kind === 'arrow') {
    const box = target.getBoundingClientRect()
    current.inside =
      event.clientX >= box.left &&
      event.clientX < box.right &&
      event.clientY >= box.top &&
      event.clientY < box.bottom
  } else if (current.kind === 'track') {
    current.pointer = along(event, target, current.axis)
  } else {
    // The thumb travels the track less its own length; the content, its
    // length less the viewport. One maps onto the other.
    const { client, size } = metrics(el, current.axis)
    const range = client - 2 * BUTTON - axes[current.axis].thumb
    if (range <= 0) return
    const moved = (current.axis === 'y' ? event.clientY : event.clientX) - current.startPointer
    setPosition(current.axis, current.startPosition + (moved * (size - client)) / range)
  }
}

function isPressed(axis: Axis, direction: 1 | -1): boolean {
  const current = hold.value
  return (
    current?.kind === 'arrow' &&
    current.axis === axis &&
    current.direction === direction &&
    current.inside
  )
}

/** Data attributes for an arrow: `data-pressed` while held, `data-disabled` with nothing to scroll. */
function arrowState(axis: Axis, direction: 1 | -1) {
  return {
    'data-pressed': isPressed(axis, direction) ? '' : undefined,
    'data-disabled': axes[axis].overflow ? undefined : '',
  }
}

function thumbStyle(axis: Axis): Record<string, string> {
  const { thumb, offset } = axes[axis]
  return axis === 'y'
    ? { height: `${String(thumb)}px`, transform: `translateY(${String(offset)}px)` }
    : { width: `${String(thumb)}px`, transform: `translateX(${String(offset)}px)` }
}

defineExpose({
  /** The element that scrolls — for reading or setting its scroll position. */
  viewport,
})
</script>

<template>
  <div data-slot="scroll-area" :class="cn(scrollAreaVariants(), props.class)">
    <div :class="scrollAreaMainVariants()">
      <!--
        Focusable only while there is something to scroll: a scrolling box
        with nothing focusable inside is otherwise unreachable by keyboard.
      -->
      <div
        ref="viewport"
        data-slot="scroll-area-viewport"
        :tabindex="scrollable ? 0 : undefined"
        :role="props.label === undefined ? undefined : 'region'"
        :aria-label="props.label"
        :class="scrollAreaViewportVariants()"
        @scroll.passive="measure"
      >
        <div ref="content" :class="scrollAreaContentVariants()">
          <slot />
        </div>
      </div>

      <!--
        The bars are hidden from assistive technology: the region itself
        scrolls from the keyboard, and arrow buttons would only be noise.
      -->
      <div
        v-if="showY"
        data-slot="scroll-area-scrollbar"
        data-orientation="vertical"
        aria-hidden="true"
        :class="scrollAreaScrollbarVariants({ orientation: 'vertical' })"
      >
        <div
          :class="scrollAreaButtonVariants()"
          v-bind="arrowState('y', -1)"
          @pointerdown="onArrowDown($event, 'y', -1)"
          @pointermove="onPointerMove"
          @pointerup="release"
          @pointercancel="release"
        >
          <TriangleUpIcon />
        </div>
        <div
          :class="scrollAreaTrackVariants()"
          @pointerdown="onTrackDown($event, 'y')"
          @pointermove="onPointerMove"
          @pointerup="release"
          @pointercancel="release"
        >
          <div
            v-if="axes.y.thumb > 0"
            data-slot="scroll-area-thumb"
            :class="scrollAreaThumbVariants({ orientation: 'vertical' })"
            :style="thumbStyle('y')"
            @pointerdown="onThumbDown($event, 'y')"
            @pointermove="onPointerMove"
            @pointerup="release"
            @pointercancel="release"
          />
        </div>
        <div
          :class="scrollAreaButtonVariants()"
          v-bind="arrowState('y', 1)"
          @pointerdown="onArrowDown($event, 'y', 1)"
          @pointermove="onPointerMove"
          @pointerup="release"
          @pointercancel="release"
        >
          <TriangleDownIcon />
        </div>
      </div>
    </div>

    <div v-if="showX" :class="scrollAreaFootVariants()">
      <div
        data-slot="scroll-area-scrollbar"
        data-orientation="horizontal"
        aria-hidden="true"
        :class="scrollAreaScrollbarVariants({ orientation: 'horizontal' })"
      >
        <div
          :class="scrollAreaButtonVariants()"
          v-bind="arrowState('x', -1)"
          @pointerdown="onArrowDown($event, 'x', -1)"
          @pointermove="onPointerMove"
          @pointerup="release"
          @pointercancel="release"
        >
          <TriangleLeftIcon />
        </div>
        <div
          :class="scrollAreaTrackVariants()"
          @pointerdown="onTrackDown($event, 'x')"
          @pointermove="onPointerMove"
          @pointerup="release"
          @pointercancel="release"
        >
          <div
            v-if="axes.x.thumb > 0"
            data-slot="scroll-area-thumb"
            :class="scrollAreaThumbVariants({ orientation: 'horizontal' })"
            :style="thumbStyle('x')"
            @pointerdown="onThumbDown($event, 'x')"
            @pointermove="onPointerMove"
            @pointerup="release"
            @pointercancel="release"
          />
        </div>
        <div
          :class="scrollAreaButtonVariants()"
          v-bind="arrowState('x', 1)"
          @pointerdown="onArrowDown($event, 'x', 1)"
          @pointermove="onPointerMove"
          @pointerup="release"
          @pointercancel="release"
        >
          <TriangleRightIcon />
        </div>
      </div>
      <div v-if="showY" :class="scrollAreaCornerVariants()" />
    </div>
  </div>
</template>
