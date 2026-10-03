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
 * Shared timing for a group of tooltips. Renders nothing.
 *
 * It exists for one behaviour rowkit cannot provide per-instance:
 * `skipDelayDuration`, the grace period that lets a pointer sweep across a
 * toolbar of icon buttons and show each tooltip immediately after the first.
 * That state is shared between tooltips, so it has to live above them.
 *
 * It keeps the prop names it had when it came from Reka UI (`delayDuration`,
 * `skipDelayDuration`) instead of rowkit's own `delay`, so existing markup
 * keeps working; `docs/components/tooltip.md` says so.
 */
export { default as TooltipProvider } from './TooltipProvider.vue'
