import { cva } from 'class-variance-authority'

/**
 * The caption button: 16×14, raised, with a glyph. Held, it sinks and the
 * glyph moves 1px right and down. The ✕ on a toast and in a dialog's title
 * bar are the same control, so they share these classes.
 *
 * The focus rectangle sits 1px outside: a 16×14 face has no room for one
 * inside. Its colour is left to the caller, because the button sits on the
 * silver face in a toast and on the navy title bar in a dialog.
 */
export const captionButtonClasses = [
  'inline-flex h-[14px] w-4 shrink-0 cursor-pointer items-center justify-center',
  'bg-card pr-px pb-px text-foreground shadow-raised',
  'active:pt-px active:pr-0 active:pb-0 active:pl-px active:shadow-pressed',
  'outline-none focus-visible:outline-1 focus-visible:outline-offset-1',
  'focus-visible:outline-dotted',
]

/** A caption button on the silver face, with the focus rectangle in the ring colour. */
export const captionButtonVariants = cva([...captionButtonClasses, 'focus-visible:outline-ring'])
