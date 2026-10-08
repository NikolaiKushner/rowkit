/**
 * `@rowkit/tokens/reference` — every token a theme may set, described.
 *
 * One entry per CSS variable a theme declares: what it is for, which
 * components read it, and its value in Windows 98 and in the modern theme's
 * two schemes. The descriptions are the JSDoc comments beside the values,
 * gathered by `scripts/generate-reference.mjs`, so they cannot drift from the
 * code. A separate entry point, so the main one stays small.
 *
 * @example
 * ```ts
 * import { tokenReference } from '@rowkit/tokens/reference'
 *
 * tokenReference.find((t) => t.name === '--color-control-primary')
 * // { group: 'color', description: 'The default button…', components: ['Button'], values: { … } }
 * ```
 */
import { tokenDescriptions } from './reference.data'
import { modernDarkVars, modernLightVars, win98Vars } from './themes'

/** The kinds of token a theme sets. */
export type TokenGroup = 'color' | 'shadow' | 'size' | 'radius' | 'style' | 'font'

/** One token a theme may set. */
export interface TokenReference {
  /** The CSS variable a theme declares. */
  name: `--${string}`
  group: TokenGroup
  /** What it is for: the comment beside its value. */
  description: string
  /** The components that read it; empty for one every component shares, like the type scale. */
  components: string[]
  /** Its value in each theme. The dark scheme lists the light value where it changes nothing. */
  values: { win98: string; modernLight: string; modernDark: string }
}

/**
 * Which components a token belongs to, by the first part of its name. A
 * token not listed — the type scale, the status colours, the bevels — is
 * shared by many.
 */
const owners: [prefix: string, components: string[]][] = [
  ['toast', ['Toast']],
  ['chip', ['FilterBar']],
  ['filter-bar', ['FilterBar']],
  ['pager', ['Pagination']],
  ['select', ['Select']],
  ['popover', ['Select']],
  ['item', ['Select']],
  ['loading', ['Select']],
  ['field', ['Input', 'Select', 'Field']],
  ['button', ['Button']],
  ['icon', ['Button']],
  ['control', ['Button']],
  ['latched', ['Button', 'ButtonGroup']],
  ['check', ['Checkbox', 'Radio']],
  ['checked', ['Checkbox', 'Radio']],
  ['on-checked', ['Checkbox', 'Radio']],
  ['radio', ['Radio']],
  ['caption', ['Window', 'Dialog']],
  ['titlebar', ['Window', 'Dialog']],
  ['title', ['Window', 'Dialog']],
  ['frame', ['Window', 'Dialog']],
  ['window', ['Window', 'Dialog']],
  ['dialog', ['Dialog']],
  ['overlay', ['Dialog']],
  ['footer', ['Dialog']],
  ['table', ['DataTable']],
  ['row', ['DataTable']],
  ['badge', ['Badge']],
  ['empty', ['EmptyState']],
  ['tooltip', ['Tooltip']],
  ['statusbar', ['StatusBar']],
  ['status', ['StatusBar']],
  ['progress', ['ProgressBar']],
  ['track', ['ProgressBar', 'ScrollArea']],
  ['scroll', ['ScrollArea']],
  ['scrollbar', ['ScrollArea']],
  ['groupbox', ['GroupBox']],
  ['legend', ['GroupBox']],
  ['skeleton', ['Skeleton']],
  ['etch', ['Separator', 'GroupBox']],
  ['link', ['Button']],
  ['press', ['Button']],
  ['animate-busy', ['Button']],
  ['dither', ['ButtonGroup', 'ScrollArea']],
  ['loading-image', ['Skeleton']],
  ['animate-loading', ['Skeleton']],
  ['animate-progress', ['ProgressBar']],
  ['animate-overlay', ['Dialog']],
  ['close-order', ['Window', 'Dialog']],
  ['header', ['DataTable']],
  ['sticky-header', ['DataTable']],
  ['invalid', ['Input', 'Select']],
  // The icon system and small glyphs are every component's.
  ['icon-tone', []],
  ['icon-pixels', []],
  ['icon-glyphs', []],
  ['icon-fill', []],
]

const PREFIX = /^--(?:color-|rk-shadow-|spacing-|radius-|rk-|font-weight-|font-|text-)/

function componentsOf(name: string): string[] {
  const bare = name.replace(PREFIX, '')
  // The longest matching prefix wins: `icon-tone-…` is the icon system's, `icon-sm` a button's.
  const match = owners
    .filter(([prefix]) => bare === prefix || bare.startsWith(`${prefix}-`))
    .sort((a, b) => b[0].length - a[0].length)[0]
  return match ? match[1] : []
}

/** Every token a theme may set, in the order the source declares them. */
export const tokenReference: TokenReference[] = (
  Object.entries(win98Vars) as [`--${string}`, string][]
).map(([name, win98]) => {
  const lineHeightOf = /^(--text-.+)--line-height$/.exec(name)?.[1]
  const [group, description] = lineHeightOf
    ? ['font', `The line height of ${lineHeightOf}.`]
    : (tokenDescriptions[name] ?? ['', ''])
  const modernLight = modernLightVars[name] ?? win98
  return {
    name,
    group: group as TokenGroup,
    description,
    components: componentsOf(name),
    values: { win98, modernLight, modernDark: modernDarkVars[name] ?? modernLight },
  }
})
