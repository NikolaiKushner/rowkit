import { inject, type InjectionKey, type Ref } from 'vue'

/** Timing shared by every tooltip under one `TooltipProvider`. */
export interface TooltipProviderContext {
  delayDuration: Ref<number>
  /**
   * True until a tooltip has opened, and again once `skipDelayDuration` has
   * passed with none open. While false, the next tooltip opens immediately —
   * which is what makes a pointer sweep across a toolbar feel right.
   */
  isOpenDelayed: Ref<boolean>
  disableHoverableContent: Ref<boolean>
  disableClosingTrigger: Ref<boolean>
  disabled: Ref<boolean>
  ignoreNonKeyboardFocus: Ref<boolean>
  onOpen: () => void
  onClose: () => void
}

export const tooltipProviderKey: InjectionKey<TooltipProviderContext> = Symbol('tooltipProvider')

/** What one `Tooltip` shares with its trigger and content. */
export interface TooltipContext {
  contentId: string
  open: Ref<boolean>
  /** `delayed-open` after the hover delay, `instant-open` on focus or a sweep. */
  state: Ref<'closed' | 'delayed-open' | 'instant-open'>
  trigger: Ref<HTMLElement | undefined>
  /** Pointer entered the trigger: open after the delay, or at once mid-sweep. */
  onTriggerEnter: () => void
  onTriggerLeave: () => void
  onOpen: () => void
  onClose: () => void
  disableHoverableContent: Ref<boolean>
  disableClosingTrigger: Ref<boolean>
  disabled: Ref<boolean>
  ignoreNonKeyboardFocus: Ref<boolean>
}

export const tooltipKey: InjectionKey<TooltipContext> = Symbol('tooltip')

export function useTooltipContext(part: string): TooltipContext {
  const context = inject(tooltipKey, null)
  if (!context) throw new Error(`<${part}> must be used inside <Tooltip>.`)
  return context
}

/** Fired on document when any tooltip opens, so the others close. */
export const TOOLTIP_OPEN = 'rk-tooltip.open'
