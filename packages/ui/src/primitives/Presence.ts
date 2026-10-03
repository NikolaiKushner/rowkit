import {
  defineComponent,
  getCurrentInstance,
  readonly,
  ref,
  watch,
  type Ref,
  type SlotsType,
  type VNode,
} from 'vue'
import { firstRenderable } from './Primitive'

/**
 * The animations an element is about to play out on close. Read straight
 * after the closed state is rendered, so the exit animation the new state
 * starts is already among them. Endless animations (a spinner on the
 * surface) are ignored: they would hold the element forever.
 */
function exitAnimations(element: unknown): Animation[] {
  if (!(element instanceof Element) || typeof element.getAnimations !== 'function') return []
  return element
    .getAnimations()
    .filter(
      (animation) =>
        animation.playState !== 'finished' &&
        animation.effect?.getComputedTiming().endTime !== Infinity
    )
}

/**
 * Whether something that opens and closes should still be in the DOM.
 *
 * It appears as soon as `present` turns true. When `present` turns false it
 * stays until the exit animation its closed state starts has finished, and
 * goes at once when there is none — reduced motion, no animation styled, or
 * an environment without animations at all.
 *
 * @param present - Whether it is open.
 * @param element - The element whose animations decide; read after the
 * closed state has rendered.
 */
export function usePresence(
  present: () => boolean,
  element: () => unknown
): Readonly<Ref<boolean>> {
  const rendered = ref(present())
  // Bumped on every change, so an exit that finishes after a reopen is ignored.
  let generation = 0

  watch(
    present,
    (open) => {
      generation += 1
      if (open) {
        rendered.value = true
        return
      }
      const running = exitAnimations(element())
      if (running.length === 0) {
        rendered.value = false
        return
      }
      const ticket = generation
      // A cancelled animation rejects `finished`; it is over all the same.
      void Promise.allSettled(running.map((animation) => animation.finished)).then(() => {
        if (ticket === generation) rendered.value = false
      })
    },
    // After the DOM shows the closed state, so its exit animation has started.
    { flush: 'post' }
  )

  return readonly(rendered)
}

/**
 * Renders its single child while `present`, and keeps it through the exit
 * animation: a `v-if` that waits for the animation to finish.
 *
 * With `forceMount` the child is always rendered, and the slot's `present`
 * tells it whether it should be showing.
 */
export const Presence = defineComponent({
  name: 'RkPresence',
  props: {
    present: { type: Boolean, required: true },
    forceMount: { type: Boolean, default: false },
  },
  slots: Object as SlotsType<{ default: (props: { present: boolean }) => VNode[] }>,
  setup(props, { slots }) {
    const instance = getCurrentInstance()
    // The root of what this component rendered: the child's element.
    const rendered = usePresence(
      () => props.present,
      () => instance?.subTree.el
    )

    return () => {
      const shown = props.present || rendered.value
      if (!props.forceMount && !shown) return null
      return firstRenderable(slots.default({ present: shown })) ?? null
    }
  },
})
