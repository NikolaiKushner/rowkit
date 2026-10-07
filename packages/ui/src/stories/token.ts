/**
 * Theme values as a story's play function sees them.
 *
 * Stories run in whichever theme the toolbar (or `VITE_RK_THEME`) picks, so a
 * play function that measures a size compares it with the theme's token rather
 * than with Windows 98's number.
 */

/** A custom property as computed on `el`, trimmed. */
export function token(name: `--${string}`, el: Element = document.documentElement): string {
  return getComputedStyle(el).getPropertyValue(name).trim()
}

/** A length token in pixels: `px('--spacing-scrollbar')` is 16 in Windows 98. */
export function px(name: `--${string}`, el: Element = document.documentElement): number {
  return Number.parseFloat(token(name, el))
}
