/**
 * Elevation shadows.
 *
 * Each shadow mixes from `--color-shadow`, a semantic token, rather than
 * hardcoding a colour — so dark mode swaps the base to pure black by
 * repointing one variable.
 *
 * Dark mode leans on surface lightness for elevation rather than on shadows.
 * A shadow is a darker region, and on a near-black page there is very little
 * headroom left to darken; the raised surface colour does the work instead.
 */
export const shadow = {
  /** No elevation. */
  none: 'none',
  /** Hairline lift — sticky table headers, input focus. */
  xs: '0 1px 2px 0 color-mix(in oklab, var(--color-shadow) 6%, transparent)',
  /** Resting cards. */
  sm: '0 1px 3px 0 color-mix(in oklab, var(--color-shadow) 8%, transparent), 0 1px 2px -1px color-mix(in oklab, var(--color-shadow) 8%, transparent)',
  /** Dropdowns, popovers. */
  md: '0 4px 6px -1px color-mix(in oklab, var(--color-shadow) 9%, transparent), 0 2px 4px -2px color-mix(in oklab, var(--color-shadow) 9%, transparent)',
  /** Menus over content. */
  lg: '0 10px 15px -3px color-mix(in oklab, var(--color-shadow) 10%, transparent), 0 4px 6px -4px color-mix(in oklab, var(--color-shadow) 10%, transparent)',
  /** Modal dialogs. */
  xl: '0 20px 25px -5px color-mix(in oklab, var(--color-shadow) 12%, transparent), 0 8px 10px -6px color-mix(in oklab, var(--color-shadow) 12%, transparent)',
  /** Horizontal-scroll affordance on a sticky table column. */
  'scroll-x': '12px 0 16px -8px color-mix(in oklab, var(--color-shadow) 22%, transparent)',
  /**
   * The rule under a sticky table header, drawn as a shadow rather than a
   * border.
   *
   * Under `border-collapse` a border belongs to the table's grid, not to any
   * cell, so a `position: sticky` header leaves its border behind and scrolls
   * away from it — the rows then slide under a header with nothing between
   * them, which is the one thing a sticky header exists to prevent. A shadow
   * belongs to the element and travels with it.
   */
  'sticky-header': 'inset 0 -1px 0 var(--color-border)',
} as const

/** Names of every shadow token. */
export type ShadowName = keyof typeof shadow
