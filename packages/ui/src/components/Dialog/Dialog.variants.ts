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
 * 50%, not the 80% the reference design pairs with its blur. Blur plus 80% black is very
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
    'rounded-lg border border-border bg-card shadow-lg',
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
export const dialogHeaderVariants = cva('flex shrink-0 flex-col gap-1 p-4 pb-3')

export const dialogTitleVariants = cva('text-lg leading-none font-semibold text-foreground')

export const dialogDescriptionVariants = cva('text-sm text-muted-foreground')

/**
 * The body is the only scrolling region. A dialog that scrolls as a whole hides
 * its own footer actions off-screen, which is where "where did the Save button
 * go" comes from.
 */
/*
 * `pt-1 pb-3`, not bare padding-inline alone.
 *
 * `overflow-y-auto` makes this a clipping boundary, and the focus ring is drawn
 * 3px *outside* the control's border box. With no vertical padding the last
 * field in a form sat flush against that boundary, so the bottom of its ring was
 * sliced off — the control looked focused on three sides and cut on the fourth.
 *
 * `pt-1` is the 4px a ring needs at the top edge; the header's own `pb-3`
 * supplies the visual gap above. `pb-3` does both jobs at the bottom, since the
 * footer's border wants clearance from the last field anyway.
 */
export const dialogBodyVariants = cva(
  'min-h-0 flex-1 overflow-y-auto px-4 pt-1 pb-3 text-sm text-foreground'
)

/*
 * The border makes the actions a separate plane from the content they act on,
 * which matters most when the body scrolls: without it, content scrolling under
 * the footer simply runs out rather than passing behind an edge.
 */
export const dialogFooterVariants = cva(
  'flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border p-4'
)

export const dialogCloseVariants = cva([
  // Same geometry as a Button `icon` at `md`: 32px square, `rounded-md`, and the
  // shared focus recipe (border + translucent ring). A borderless opaque ring
  // in the brand colour read as a blue square around the X.
  'absolute right-3 top-3 inline-flex size-8 shrink-0 cursor-pointer',
  'items-center justify-center rounded-md border border-transparent',
  'text-muted-foreground opacity-70 hover:opacity-100',
  'transition-colors duration-fast ease-standard',
  'hover:bg-accent hover:text-foreground',
  'outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
])

export type DialogVariants = VariantProps<typeof dialogContentVariants>
