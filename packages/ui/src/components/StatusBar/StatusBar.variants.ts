import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The Windows 98 status bar, as in the Figma file: a 27px strip on the silver
 * face, 2px of padding, sections 2px apart. The modern theme lays the
 * sections out as muted text 16px apart, with no frames. The first section takes the room
 * the others leave; give the rest a width with `class`.
 */
export const statusBarVariants = cva([
  'flex h-statusbar w-full items-stretch gap-statusbar-gap bg-background px-statusbar-px py-statusbar-py',
  'font-sans text-ui text-muted-foreground shadow-statusbar',
  '[&>[data-slot=status-bar-section]:first-child]:flex-1',
])

/**
 * One cell: 23px tall in the thin sunken status bevel, 4px in from each side,
 * the text cut off with an ellipsis rather than wrapped.
 */
export const statusBarSectionVariants = cva(
  'flex min-w-0 shrink-0 items-center gap-statusbar-section-gap truncate px-statusbar-section-px shadow-status'
)

export type StatusBarVariants = VariantProps<typeof statusBarVariants>
