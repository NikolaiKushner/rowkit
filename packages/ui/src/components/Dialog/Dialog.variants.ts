import { cva, type VariantProps } from 'class-variance-authority'
import { captionButtonClasses } from '../captionButton.variants'

/**
 * The layer behind the window. Transparent: a Windows 98 dialog draws no
 * backdrop. It is still there to catch the click outside and to hold the
 * scroll lock. `z-overlay` sits below `z-modal` — asserted in the token
 * package's stacking test.
 */
export const dialogOverlayVariants = cva('fixed inset-0 z-overlay')

/**
 * The window: a silver face in the window bevel, 2px of frame around the
 * title bar and the content. It opens centred and instantly; nothing slides.
 */
export const dialogContentVariants = cva(
  [
    'fixed left-1/2 top-1/2 z-modal -translate-x-1/2 -translate-y-1/2',
    'flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] flex-col',
    'group/dialog bg-card p-0.5 font-sans text-ui text-foreground shadow-window',
    'focus-visible:outline-none',
  ],
  {
    variants: {
      /**
       * Width preset: 320, 440 or 600px, narrowed to fit a small screen.
       * Height is always content-driven, capped to the viewport.
       */
      size: {
        sm: 'max-w-[320px]',
        md: 'max-w-[440px]',
        lg: 'max-w-[600px]',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

/**
 * The title bar: 18px of navy-to-blue gradient across the top of the window,
 * with the close button at its right end. `DialogContent` draws it, so the
 * bar is there whatever the consumer puts in the header; `DialogTitle` is
 * laid over it. Grey while another dialog is open above this one.
 */
export const dialogTitleBarVariants = cva([
  'flex h-[18px] shrink-0 items-center justify-end px-0.5',
  'bg-linear-to-r from-titlebar-from to-titlebar-to',
  'group-data-inactive/dialog:from-titlebar-inactive-from',
  'group-data-inactive/dialog:to-titlebar-inactive-to',
])

/**
 * The header holds what sits under the title bar — a description, an
 * eyebrow. The title itself is lifted into the bar, so a header holding only
 * the title takes no room, and one holding more starts 12px below the bar.
 * Description, body and footer are 12px apart and 12px in from the frame.
 */
export const dialogHeaderVariants = cva(
  'flex shrink-0 flex-col gap-1 px-3 has-[>:not([data-slot=dialog-title])]:pt-3'
)

/**
 * The title, laid over the title bar: bold white caption text, cut off with
 * an ellipsis 4px before the close button. Positioned against the window
 * rather than placed inside the bar, so it stays a child of the header the
 * consumer composed: 2px of frame plus the bar's 2px of padding on the left;
 * on the right, the same plus the 16px button and the 4px gap.
 */
export const dialogTitleVariants = cva([
  'absolute top-0.5 right-6 left-1 h-[18px] truncate',
  'text-ui leading-[18px] font-bold text-titlebar-foreground',
  'group-data-inactive/dialog:text-titlebar-inactive-foreground',
])

export const dialogDescriptionVariants = cva('text-ui text-foreground')

/**
 * The body is the only scrolling region. A dialog that scrolls as a whole hides
 * its own footer actions off-screen, which is where "where did the Save button
 * go" comes from.
 */
/*
 * `pb-1`, with the footer's `pt-2` making up the 12px gap: `overflow-y-auto`
 * makes this a clipping boundary, and a focus rectangle drawn outside the last
 * control would otherwise be cut along its bottom edge.
 */
export const dialogBodyVariants = cva(
  'min-h-0 flex-1 overflow-y-auto px-3 pt-3 pb-1 text-ui text-foreground'
)

/**
 * The command buttons, right-aligned along the bottom with 6px between them,
 * the default (OK) first, as on every Windows 98 dialog. No rule above them:
 * the window face is one plane.
 */
export const dialogFooterVariants = cva(
  'flex shrink-0 flex-wrap items-center justify-end gap-1.5 bg-card px-3 pt-2 pb-3'
)

/**
 * The ✕ caption button at the right end of the title bar. Its focus
 * rectangle is white, since it is drawn on the navy bar.
 */
export const dialogCloseVariants = cva([
  ...captionButtonClasses,
  'focus-visible:outline-titlebar-foreground',
])

export type DialogVariants = VariantProps<typeof dialogContentVariants>
