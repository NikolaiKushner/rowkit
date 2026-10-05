import { cva, type VariantProps } from 'class-variance-authority'

/**
 * A skeleton is a dithered plate — the white-and-silver checker Windows 98
 * used for things not yet there — and every variant shares that fill,
 * differing only in geometry.
 *
 * Each variant carries a default height and width so a bare `<Skeleton />`
 * renders something visible. A placeholder that collapses to zero height is
 * worse than no placeholder: the layout still jumps when the data lands, which
 * is the one thing a skeleton exists to prevent.
 */
export const skeletonVariants = cva('block shrink-0 bg-dither', {
  variants: {
    /** Geometry preset. Square corners, as everything in Windows 98 but the round controls. */
    variant: {
      /** A line of text: 11px, so it sits on the 16px line like the letters it stands in for. */
      text: 'h-[11px] w-full',
      /** Avatars. Besides the option button, the one round shape in the system. */
      circle: 'size-10 rounded-full',
      /** Thumbnails, cards, controls. */
      rect: 'h-4 w-full',
    },
    /**
     * Windows 98 never pulses. Animated, the checker steps 1px sideways every
     * 400ms — two frames, no easing — and `motion-safe:` keeps it still for
     * anyone who has asked for reduced motion.
     */
    animated: {
      true: 'motion-safe:animate-dither',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'text',
    animated: true,
  },
})

export type SkeletonVariants = VariantProps<typeof skeletonVariants>
