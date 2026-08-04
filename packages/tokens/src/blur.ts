/**
 * Backdrop blur radii.
 *
 * One entry, and named for its job rather than a t-shirt size. Blur is not a
 * scale rowkit designs with — it appears in exactly one place, behind a modal,
 * and a second value would be a decision nobody has had to make yet.
 *
 * Deliberately small. The scrim separates the planes; the blur only stops the
 * page behind from competing for the eye. Anything heavier reads as an effect
 * and makes the content behind unrecognisable, which defeats the reason a
 * modal shows its context at all.
 */
export const blur = {
  /** The dialog scrim. The reference `backdrop-blur-xs`. */
  overlay: '4px',
} as const

/** Names of every blur token. */
export type BlurName = keyof typeof blur
