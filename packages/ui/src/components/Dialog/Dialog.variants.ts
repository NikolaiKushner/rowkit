import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The scrim. `z-overlay` sits below `z-modal` so the surface paints over its own
 * backdrop — asserted in the token package's stacking test.
 *
 * The blur is guarded by `supports-[backdrop-filter]`. `backdrop-filter` is
 * missing or switched off in more places than its support table suggests —
 * older WebKit, some Linux GPU configurations, forced-colors mode — and an
 * unguarded blur degrades to a plain scrim on those machines silently. The
 * guard turns that into a declared fallback: everyone gets the 50% scrim, and
 * the blur is the enhancement on top.
 *
 * 50%, not the 80% shadcn pairs with its blur. Blur plus 80% black is very
 * nearly opaque, and the reason to blur rather than simply darken is that the
 * page behind should still read as context.
 */
export const dialogOverlayVariants = cva([
  'fixed inset-0 z-overlay bg-shadow/50',
  'supports-[backdrop-filter]:backdrop-blur-overlay',
  'motion-safe:data-[state=open]:animate-overlay-in',
  'motion-safe:data-[state=closed]:animate-overlay-out',
])

export const dialogContentVariants = cva(
  [
    'fixed left-1/2 top-1/2 z-modal -translate-x-1/2 -translate-y-1/2',
    'flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] flex-col',
    'rounded-lg border border-border bg-surface shadow-xl',
    'focus-visible:outline-none',
    'motion-safe:data-[state=open]:animate-dialog-in',
    'motion-safe:data-[state=closed]:animate-dialog-out',
  ],
  {
    variants: {
      /** Width preset. Height is always content-driven, capped to the viewport. */
      size: {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-lg',
        lg: 'sm:max-w-2xl',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

/** Header, body and footer are separate rows so only the body scrolls. */
export const dialogHeaderVariants = cva('flex shrink-0 flex-col gap-1 p-6 pb-4')

export const dialogTitleVariants = cva('text-lg font-semibold text-text')

export const dialogDescriptionVariants = cva('text-sm text-text-muted')

/**
 * The body is the only scrolling region. A dialog that scrolls as a whole hides
 * its own footer actions off-screen, which is where "where did the Save button
 * go" comes from.
 */
export const dialogBodyVariants = cva('min-h-0 flex-1 overflow-y-auto px-6 text-sm text-text')

export const dialogFooterVariants = cva(
  'flex shrink-0 flex-wrap items-center justify-end gap-3 p-6 pt-4'
)

export const dialogCloseVariants = cva([
  'absolute right-4 top-4 inline-flex size-8 shrink-0 cursor-pointer',
  'items-center justify-center rounded-sm text-text-muted',
  'transition-colors duration-fast ease-standard',
  'hover:bg-surface-hover hover:text-text',
  'outline-none focus-visible:ring-3 focus-visible:ring-focus-ring',
])

export type DialogVariants = VariantProps<typeof dialogContentVariants>
