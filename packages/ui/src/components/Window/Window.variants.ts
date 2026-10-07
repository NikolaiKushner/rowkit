import { cva, type VariantProps } from 'class-variance-authority'
import { captionButtonClasses } from '../captionButton.variants'

/**
 * A Windows 98 window, as in the Figma file: the silver face in the window
 * bevel, 2px of frame around the title bar, the body and a status bar.
 */
export const windowVariants = cva([
  'group/window flex flex-col rounded-xl bg-card p-frame shadow-window',
  // The last part — a body or a status bar — follows the window's corners.
  '[&>:last-child]:rounded-b-xl',
  'font-sans text-ui text-foreground',
])

/**
 * The title bar: 22px of navy-to-blue gradient, 2px in from each side, 4px
 * between the icon, the title and the caption buttons. An inactive window's
 * bar is the grey gradient.
 */
export const windowTitleBarVariants = cva([
  'group/titlebar flex h-titlebar shrink-0 items-center gap-1 px-titlebar-px',
  'rounded-t-xl bg-linear-to-r from-titlebar-from to-titlebar-to shadow-titlebar',
  'group-data-inactive/window:from-titlebar-inactive-from',
  'group-data-inactive/window:to-titlebar-inactive-to',
])

/** The title: bold, white — black when inactive — and cut off with an ellipsis. */
export const windowTitleVariants = cva([
  'min-w-0 flex-1 truncate font-strong text-titlebar-foreground',
  '[text-align:var(--rk-titlebar-align)] pr-(--rk-titlebar-balance)',
  'group-data-inactive/window:text-titlebar-inactive-foreground',
])

/**
 * The caption buttons. Minimize and maximize sit together; close stands 2px
 * apart, as Windows 98 grouped them.
 */
export const windowControlsVariants = cva([
  'flex shrink-0 items-center gap-caption-gap order-(--rk-caption-order)',
  '[&>[data-glyph=close]]:order-(--rk-close-order)',
  '[&>[data-glyph=close]:not(:first-child)]:ml-caption-close-gap',
])

/**
 * A caption button: the shared 20×18 raised button. Its focus rectangle is
 * white, drawn on the title bar. Disabled, the glyph is grey and embossed.
 */
export const windowButtonVariants = cva([
  ...captionButtonClasses,
  'focus-visible:outline-titlebar-foreground',
  'group-data-inactive/window:bg-caption-inactive',
  'disabled:pointer-events-none disabled:text-text-disabled',
  'disabled:[&_svg]:drop-shadow-[1px_1px_0_var(--color-text-disabled-emboss)]',
])

/**
 * The body: fills the window between the title bar and a status bar.
 * `flex-auto`, not `flex-1`: a zero basis would ignore a height given with
 * `class` in a window that has no height of its own, and collapse the body.
 */
export const windowBodyVariants = cva('scrollbar-themed min-h-0 flex-auto')

export type WindowVariants = VariantProps<typeof windowVariants>
