import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The Windows 98 status bar, as in the Figma file: a 22px strip on the silver
 * face, 2px of padding, sections 2px apart. The first section takes the room
 * the others leave; give the rest a width with `class`.
 */
export const statusBarVariants = cva([
  'flex h-[22px] w-full items-stretch gap-0.5 bg-card p-0.5',
  'font-sans text-ui text-foreground',
  '[&>[data-slot=status-bar-section]:first-child]:flex-1',
])

/**
 * One cell: 18px tall in the thin sunken status bevel, 4px in from each side,
 * the text cut off with an ellipsis rather than wrapped.
 */
export const statusBarSectionVariants = cva(
  'flex min-w-0 shrink-0 items-center gap-1 truncate px-1 shadow-status'
)

export type StatusBarVariants = VariantProps<typeof statusBarVariants>
