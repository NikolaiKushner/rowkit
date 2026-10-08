/**
 * `rowkit/theme` — make a theme of your own without installing anything else.
 *
 * The theming functions of `@rowkit/tokens`, from the copy rowkit itself
 * depends on: the theme you write always matches the components you render,
 * and a pnpm project, which can only import its own dependencies, needs
 * nothing besides `rowkit`.
 *
 * @example
 * ```ts
 * import { defineTheme } from 'rowkit/theme'
 *
 * export const acme = defineTheme({
 *   name: 'acme', // <html data-theme="acme">
 *   extends: 'modern',
 *   light: { '--color-control-primary': '#5b3df5', '--radius-md': '10px' },
 * })
 * ```
 */
export {
  defineTheme,
  modernDarkVars,
  modernLightVars,
  themeNames,
  themeRule,
  win98Vars,
} from '@rowkit/tokens'
export type {
  ThemeDefinition,
  ThemeName,
  ThemeTokenName,
  ThemeValues,
  ThemeVars,
} from '@rowkit/tokens'
