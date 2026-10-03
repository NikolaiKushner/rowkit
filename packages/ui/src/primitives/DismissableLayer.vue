<script setup lang="ts">
import { computed, onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  closeLayer,
  createLayer,
  openLayer,
  receivesPointer,
  syncPageBlocking,
  type FocusOutsideEvent,
  type PointerDownOutsideEvent,
} from './dismissableLayer'

/**
 * A surface that closes when the user is done with it: Escape, a pointer
 * going down outside it, or focus moving away.
 *
 * Each of those is announced first as a cancelable event. When no handler
 * cancels it, `dismiss` follows; the layer never closes itself. Layers stack:
 * see `dismissableLayer.ts` for which layer hears what.
 */
const props = withDefaults(
  defineProps<{
    /** Make the page below inert to the pointer while this layer is open. */
    disableOutsidePointerEvents?: boolean
  }>(),
  { disableOutsidePointerEvents: false }
)

const emit = defineEmits<{
  /** Escape was pressed while this was the topmost layer. Cancelable. */
  escapeKeyDown: [event: KeyboardEvent]
  /** A pointer went down outside. Cancelable. */
  pointerDownOutside: [event: PointerDownOutsideEvent]
  /** Focus moved outside. Cancelable. */
  focusOutside: [event: FocusOutsideEvent]
  /** The layer should close: one of the above happened and nobody cancelled it. */
  dismiss: []
}>()

const root = ref<HTMLElement>()

const layer = createLayer(
  {
    onEscape(event) {
      emit('escapeKeyDown', event)
      if (!event.defaultPrevented) emit('dismiss')
    },
    onPointerOutside(event) {
      emit('pointerDownOutside', event)
      if (!event.defaultPrevented) emit('dismiss')
    },
    onFocusOutside(event) {
      emit('focusOutside', event)
      if (!event.defaultPrevented) emit('dismiss')
    },
  },
  props.disableOutsidePointerEvents
)

onBeforeMount(() => openLayer(layer))
onMounted(() => {
  layer.element = root.value
})
onUnmounted(() => closeLayer(layer))

watch(
  () => props.disableOutsidePointerEvents,
  (blocking) => {
    layer.blocking = blocking
    syncPageBlocking()
  }
)

/** The page is inert while a modal layer is open; this layer opts back in when it may. */
const style = computed(() =>
  receivesPointer(layer) ? { pointerEvents: 'auto' as const } : undefined
)
</script>

<template>
  <div ref="root" data-dismissable-layer :style="style">
    <slot />
  </div>
</template>
