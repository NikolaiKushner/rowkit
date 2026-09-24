export { default as Tooltip } from './Tooltip.vue'
export { default as TooltipContent } from './TooltipContent.vue'
export { default as TooltipTrigger } from './TooltipTrigger.vue'
export { tooltipContentVariants, type TooltipVariants } from './Tooltip.variants'
export type {
  TooltipContentProps,
  TooltipPlacement,
  TooltipProps,
  TooltipTriggerProps,
} from './types'

/**
 * Reka's provider, re-exported unwrapped.
 *
 * It exists for one behaviour rowkit cannot provide per-instance:
 * `skipDelayDuration`, the grace period that lets a pointer sweep across a
 * toolbar of icon buttons and show each tooltip immediately after the first.
 * That state is shared between tooltips, so it has to live above them.
 *
 * Re-exported rather than wrapped because it renders nothing — wrapping would
 * add a component, a props table and a docs page to rename two options. It is
 * the one place rowkit's API surface uses Reka's prop names (`delayDuration`,
 * `skipDelayDuration`) instead of its own; `docs/components/tooltip.md` says so.
 */
export { TooltipProvider } from 'reka-ui'
