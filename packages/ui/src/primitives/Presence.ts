import {
  cloneVNode,
  Comment,
  computed,
  defineComponent,
  nextTick,
  onUnmounted,
  ref,
  toRef,
  watch,
  type ComponentPublicInstance,
  type Ref,
  type SlotsType,
  type VNode,
} from 'vue'
import { isClient, unrefElement } from './dom'

type PresenceState = 'mounted' | 'unmountSuspended' | 'unmounted'
type PresenceEvent = 'MOUNT' | 'UNMOUNT' | 'ANIMATION_OUT' | 'ANIMATION_END'

const machine: Record<PresenceState, Partial<Record<PresenceEvent, PresenceState>>> = {
  mounted: { UNMOUNT: 'unmounted', ANIMATION_OUT: 'unmountSuspended' },
  unmountSuspended: { MOUNT: 'mounted', ANIMATION_END: 'unmounted' },
  unmounted: { MOUNT: 'mounted' },
}

function animationName(node?: HTMLElement): string {
  return node ? getComputedStyle(node).animationName || 'none' : 'none'
}

/**
 * Keeps an element mounted after `present` turns false until its exit
 * animation finishes, so a closing overlay can animate out instead of
 * vanishing. With no animation it unmounts immediately.
 *
 * There is no `animationrun` event and `animationstart` fires only after any
 * delay, so a starting exit animation is detected by `animation-name`
 * changing between the open and the closing styles.
 */
export function usePresence(present: Ref<boolean>, node: Ref<HTMLElement | undefined>) {
  const state = ref<PresenceState>(present.value ? 'mounted' : 'unmounted')
  const dispatch = (event: PresenceEvent) => {
    state.value = machine[state.value][event] ?? state.value
  }

  let styles: CSSStyleDeclaration | undefined
  const prevAnimationName = ref('none')
  let timeoutId: number | undefined

  watch(
    present,
    async (current, previous) => {
      const changed = previous !== current
      await nextTick()
      if (!changed) return
      const currentAnimation = animationName(node.value)

      if (current) {
        dispatch('MOUNT')
      } else if (
        currentAnimation === 'none' ||
        currentAnimation === 'undefined' ||
        styles?.display === 'none'
      ) {
        dispatch('UNMOUNT')
      } else if (previous && prevAnimationName.value !== currentAnimation) {
        dispatch('ANIMATION_OUT')
      } else {
        dispatch('UNMOUNT')
      }
    },
    { immediate: true }
  )

  /*
   * Starting an exit during an enter fires `animationcancel` for the enter
   * after the state has moved on, so only the currently running animation may
   * end the suspension.
   */
  const onAnimationEnd = (event: AnimationEvent) => {
    const el = node.value
    if (!el || event.target !== el) return
    const current = animationName(el)
    if (current.includes(CSS.escape(event.animationName))) {
      dispatch('ANIMATION_END')
      if (!present.value) {
        // Hold the final frame until the node is gone; resetting any sooner
        // than a macrotask flashes the open state for a frame.
        const fillMode = el.style.animationFillMode
        el.style.animationFillMode = 'forwards'
        timeoutId = window.setTimeout(() => {
          if (el.style.animationFillMode === 'forwards') el.style.animationFillMode = fillMode
        })
      }
    }
    if (current === 'none') dispatch('ANIMATION_END')
  }

  const onAnimationStart = (event: AnimationEvent) => {
    if (event.target === node.value) prevAnimationName.value = animationName(node.value)
  }

  const listen = (el: HTMLElement) => {
    el.addEventListener('animationstart', onAnimationStart)
    el.addEventListener('animationcancel', onAnimationEnd)
    el.addEventListener('animationend', onAnimationEnd)
  }
  const unlisten = (el: HTMLElement) => {
    el.removeEventListener('animationstart', onAnimationStart)
    el.removeEventListener('animationcancel', onAnimationEnd)
    el.removeEventListener('animationend', onAnimationEnd)
  }

  const stopNode = watch(
    node,
    (next, previous) => {
      if (next) {
        styles = getComputedStyle(next)
        listen(next)
      } else {
        // The node went away early; nothing is left to wait for.
        dispatch('ANIMATION_END')
        if (timeoutId !== undefined) window.clearTimeout(timeoutId)
        if (previous) unlisten(previous)
      }
    },
    { immediate: true }
  )

  const stopState = watch(state, () => {
    prevAnimationName.value = state.value === 'mounted' ? animationName(node.value) : 'none'
  })

  onUnmounted(() => {
    stopNode()
    stopState()
    if (node.value) unlisten(node.value)
    if (timeoutId !== undefined && isClient) window.clearTimeout(timeoutId)
  })

  return { isPresent: computed(() => state.value !== 'unmounted') }
}

/**
 * Renders its single child while `present`, and keeps it through the exit
 * animation. Works like `v-if` that waits for the animation to finish.
 */
export const Presence = defineComponent({
  name: 'RkPresence',
  props: {
    present: { type: Boolean, required: true },
    forceMount: { type: Boolean, default: false },
  },
  slots: Object as SlotsType<{ default: (props: { present: boolean }) => VNode[] }>,
  setup(props, { slots }) {
    const node = ref<HTMLElement>()
    const { isPresent } = usePresence(toRef(props, 'present'), node)

    const setNode = (value: unknown) => {
      node.value = unrefElement(value as Element | ComponentPublicInstance | null)
    }

    return () => {
      if (!props.forceMount && !props.present && !isPresent.value) return null
      // Template comments render as nodes in development; skip them so a
      // comment above the child does not take its place.
      const child = slots.default({ present: isPresent.value }).find((n) => n.type !== Comment)
      return child ? cloneVNode(child, { ref: setNode }, true) : null
    }
  },
})
