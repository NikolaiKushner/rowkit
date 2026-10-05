import { cva, type VariantProps } from 'class-variance-authority'

/**
 * The root: the viewport with the bars beside and below it. A column of flex
 * rows rather than a grid, so a `max-h-*` alone bounds it — a grid row sized
 * `1fr` ignores a max-height and grows with its content.
 */
export const scrollAreaVariants = cva('flex min-h-0 min-w-0 flex-col overflow-hidden')

/** The row holding the viewport and the vertical bar. */
export const scrollAreaMainVariants = cva('flex min-h-0 min-w-0 flex-auto')

/**
 * The element that scrolls. The browser's own bar is hidden; the drawn ones
 * take its place beside it, so they never cover the content. The dotted focus
 * rectangle sits just inside, where the clipping cannot cut it.
 */
export const scrollAreaViewportVariants = cva([
  'min-h-0 min-w-0 flex-auto overflow-auto',
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  'outline-none focus-visible:outline-1 focus-visible:-outline-offset-1',
  'focus-visible:outline-dotted focus-visible:outline-ring',
])

/**
 * What the slot renders into. `w-fit min-w-full`: text wraps at the
 * viewport's width as usual, while something wider than the viewport — a
 * table — widens this box, which is what the size observer sees.
 */
export const scrollAreaContentVariants = cva('w-fit min-w-full')

/** A bar: 16px thick, arrow, track, arrow. */
export const scrollAreaScrollbarVariants = cva('flex shrink-0 touch-none select-none', {
  variants: {
    orientation: {
      vertical: 'w-4 flex-col',
      horizontal: 'h-4 min-w-0 flex-auto',
    },
  },
  defaultVariants: { orientation: 'vertical' },
})

/** The row under the viewport: the horizontal bar and the corner. */
export const scrollAreaFootVariants = cva('flex h-4 shrink-0')

/**
 * An arrow button: 16×16, raised, the 8px triangle centred. Held, it goes flat
 * with a grey frame and the triangle steps 1px down and right. With nothing
 * to scroll, the triangle is grey.
 */
export const scrollAreaButtonVariants = cva([
  'flex size-4 shrink-0 items-center justify-center bg-card text-foreground shadow-raised',
  'data-pressed:pt-px data-pressed:pl-px',
  'data-pressed:shadow-[inset_0_0_0_1px_var(--color-bevel-shadow)]',
  'data-disabled:text-text-disabled',
])

/** The track: the white-and-silver dither the thumb slides along. */
export const scrollAreaTrackVariants = cva('relative min-h-0 min-w-0 flex-auto bg-dither')

/** The thumb: raised, its length the share of the content in view. */
export const scrollAreaThumbVariants = cva('absolute bg-card shadow-raised', {
  variants: {
    orientation: {
      vertical: 'inset-x-0 top-0',
      horizontal: 'inset-y-0 left-0',
    },
  },
  defaultVariants: { orientation: 'vertical' },
})

/** Where the two bars meet: plain face. */
export const scrollAreaCornerVariants = cva('size-4 shrink-0 bg-card')

export type ScrollAreaScrollbarVariants = VariantProps<typeof scrollAreaScrollbarVariants>
