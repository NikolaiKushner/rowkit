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
 * Its props are `delayDuration` and `skipDelayDuration` rather than rowkit's
 * `delay`, kept as they were so existing markup keeps working;
 * `docs/components/tooltip.md` says so.
 */
export { default as TooltipProvider } from './TooltipProvider.vue'
