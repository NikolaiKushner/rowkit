import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The scrim. `z-overlay` sits below `z-modal` so the surface paints over its own
 * backdrop — asserted in the token package's stacking test.
 *
 * A plain 50% scrim, no blur: the design draws no backdrop effect, and this
 * is restyled with the rest of Dialog to match it.
 */
export const dialogOverlayVariants = cva([
  'fixed inset-0 z-overlay bg-shadow/50',
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
  // Hairline above the actions — same plane separation shadcn uses so a
  // scrolling body does not run into the buttons.
  'flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border bg-card px-4 py-3'
)

export const dialogCloseVariants = cva([
  // Ghost chrome — same quiet exit as a footer Cancel, not an outlined icon tile.
  // Solid ring (not /50): no border half to carry contrast on a borderless control.
  'absolute right-3 top-3 inline-flex size-8 shrink-0 cursor-pointer',
  'items-center justify-center rounded-md border-0 bg-transparent',
  'text-muted-foreground opacity-70 hover:opacity-100',
  'transition-colors duration-fast ease-standard',
  'hover:bg-accent hover:text-foreground',
  'outline-none focus-visible:ring-3 focus-visible:ring-ring',
])

export type DialogVariants = VariantProps<typeof dialogContentVariants>
