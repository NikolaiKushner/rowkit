/**
 * Corner radii.
 *
 * Restrained by design: heavily rounded corners waste horizontal space at the
 * edges of a dense grid and make adjacent cells read as separate objects.
 */
export const radius = {
  /** Square. Table cells, and anything that tiles edge to edge. */
  none: '0rem',
  /** 2px — checkboxes, tags inside a cell. */
  xs: '0.125rem',
  /** 4px — inputs, buttons, badges. The rowkit default. */
  sm: '0.25rem',
  /** 6px — cards, popovers. */
  md: '0.375rem',
  /** 8px — dialogs. */
  lg: '0.5rem',
  /** 12px — large empty-state panels. */
  xl: '0.75rem',
  /** Pill. Status chips and avatars. */
  full: '9999px',
} as const

/** Names of every radius token. */
export type RadiusName = keyof typeof radius
