import { cva, type VariantProps } from 'class-variance-authority'

/**
 * A skeleton is a shape, not a colour — every variant shares one fill and
 * differs only in geometry.
 *
 * Each variant carries a default height and width so a bare `<Skeleton />`
 * renders something visible. A placeholder that collapses to zero height is
 * worse than no placeholder: the layout still jumps when the data lands, which
 * is the one thing a skeleton exists to prevent.
 */
export const skeletonVariants = cva('block shrink-0 bg-skeleton', {
  variants: {
    /** Geometry preset. */
    variant: {
      // The reference design's Skeleton is a single `rounded-md` shape. rowkit keeps the
      // geometry presets, but the corner is the reference design's at every one of them.
      /** A line of text. Height tracks the `sm`/`base` line box. */
      text: 'h-4 w-full rounded-md',
      /** Avatars and icon buttons. */
      circle: 'size-10 rounded-full',
      /** Thumbnails, cards, table cells. */
      rect: 'h-4 w-full rounded-md',
    },
    /**
     * `motion-safe:` rather than a bare `animate-pulse`, so the pulse is absent
     * for anyone who has asked for reduced motion. A looping animation is
     * exactly the kind that triggers vestibular symptoms, and it conveys no
     * information the static shape does not.
     */
    animated: {
      true: 'motion-safe:animate-pulse',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'text',
    animated: true,
  },
})

export type SkeletonVariants = VariantProps<typeof skeletonVariants>
