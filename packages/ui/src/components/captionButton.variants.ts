import { cva } from 'class-variance-authority'

/**
 * The caption button: 20×18, raised, with a glyph. Held, it sinks and the
 * glyph moves 1px right and down. The ✕ on a toast and in a dialog's title
 * bar are the same control, so they share these classes.
 *
 * In the modern theme the same button is a 12px dot — red to close, amber to
 * minimise, green to maximise — whose glyph appears when the pointer is over
 * the title bar (or the button, or it has focus). The fills are per glyph
 * (`data-glyph`); a button without one, such as a toast's, takes `caption`.
 *
 * The focus rectangle sits 1px outside: a 20×18 face has no room for one
 * inside. Its colour is left to the caller, because the button sits on the
 * silver face in a toast and on the navy title bar in a dialog.
 */
export const captionButtonClasses = [
  'inline-flex h-caption-h w-caption-w shrink-0 cursor-pointer items-center justify-center',
  'rounded-pill bg-caption text-caption-foreground shadow-caption',
  'pr-(--rk-press-shift) pb-(--rk-press-shift)',
  'data-[glyph=close]:bg-caption-close data-[glyph=minimize]:bg-caption-minimize',
  'data-[glyph=maximize]:bg-caption-maximize data-[glyph=restore]:bg-caption-maximize',
  'active:pt-(--rk-press-shift) active:pr-0 active:pb-0 active:pl-(--rk-press-shift)',
  'active:shadow-pressed active:brightness-(--rk-press-brightness)',
  '[&_svg]:opacity-(--rk-caption-glyph-opacity) hover:[&_svg]:opacity-100',
  'group-hover/titlebar:[&_svg]:opacity-100 focus-visible:[&_svg]:opacity-100',
  'outline-none focus-visible:focus-ring focus-visible:outline-offset-1',
]

/** A caption button on the silver face, with the focus rectangle in the ring colour. */
export const captionButtonVariants = cva([...captionButtonClasses, 'focus-visible:outline-ring'])
