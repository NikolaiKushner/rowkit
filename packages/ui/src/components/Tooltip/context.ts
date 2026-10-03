import { inject, type InjectionKey, type Ref } from 'vue'

/**
 * The value of `data-state` on the trigger and the bubble.
 *
 * Two open states rather than one, so a stylesheet can tell a tooltip the user
 * waited for from one that appeared at once — while sweeping a toolbar, or on
 * keyboard focus.
 */
export type TooltipState = 'closed' | 'delayed-open' | 'instant-open'

/** What `TooltipProvider` shares with every tooltip below it. */
export interface TooltipGroup {
  /** Hover delay for a tooltip that has to wait, in milliseconds. */
  delay: Readonly<Ref<number>>
  /**
   * True while a tooltip in the group is open, and for `skipDelayDuration`
   * after the last one closed. A tooltip that opens on hover while this holds
   * skips the delay.
   */
  warm: Readonly<Ref<boolean>>
  /** The pointer may leave the trigger for the bubble without closing it. */
  hoverableContent: Readonly<Ref<boolean>>
  /** Activating the trigger closes its tooltip. */
  closesOnActivate: Readonly<Ref<boolean>>
  /** Only focus the browser would draw a focus ring for opens a tooltip. */
  keyboardFocusOnly: Readonly<Ref<boolean>>
  disabled: Readonly<Ref<boolean>>
  /** A tooltip in the group opened. */
  opened: () => void
  /** A tooltip in the group closed. */
  closed: () => void
}

export const tooltipGroupKey: InjectionKey<TooltipGroup> = Symbol('tooltipGroup')

export function useTooltipGroup(part: string): TooltipGroup {
  const group = inject(tooltipGroupKey, null)
  if (!group) throw new Error(`<${part}> must be used inside <TooltipProvider>.`)
  return group
}

/** What the root of one tooltip shares with its trigger and content. */
export interface TooltipContext {
  /** The bubble's id, which the trigger's `aria-describedby` points at. */
  contentId: string
  open: Readonly<Ref<boolean>>
  state: Readonly<Ref<TooltipState>>
  /** Set by the trigger: the anchor for positioning and for the hover area. */
  triggerElement: Ref<HTMLElement | undefined>
  /** Set by the content while the bubble is rendered. */
  bubbleElement: Ref<HTMLElement | undefined>
  /** Listeners the trigger binds to its element. */
  triggerListeners: TooltipTriggerListeners
  /** Close now: Escape, a press outside, or anything else that dismisses it. */
  dismiss: () => void
}

export interface TooltipTriggerListeners {
  pointerenter: (event: PointerEvent) => void
  pointerleave: (event: PointerEvent) => void
  pointerdown: (event: PointerEvent) => void
  click: () => void
  focus: () => void
  blur: () => void
}

export const tooltipKey: InjectionKey<TooltipContext> = Symbol('tooltip')

export function useTooltipContext(part: string): TooltipContext {
  const context = inject(tooltipKey, null)
  if (!context) throw new Error(`<${part}> must be used inside <Tooltip>.`)
  return context
}

/**
 * Closes whichever tooltip is showing, anywhere on the page.
 *
 * One label at a time: a tooltip still open on a focused button would sit
 * over the one the pointer just asked for, and two bubbles read as noise.
 * Kept at module level because the rule crosses providers — a standalone
 * `Tooltip` brings its own.
 */
let closeShowing: (() => void) | undefined

/** Records `close` as the tooltip on screen, closing the one before it. */
export function takeScreen(close: () => void): void {
  if (closeShowing && closeShowing !== close) closeShowing()
  closeShowing = close
}

/** Forgets `close` if it is still the tooltip on screen. */
export function leaveScreen(close: () => void): void {
  if (closeShowing === close) closeShowing = undefined
}
