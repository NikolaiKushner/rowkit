# @rowkit/tokens

[![npm](https://img.shields.io/npm/v/@rowkit/tokens/beta?color=D63A1F)](https://www.npmjs.com/package/@rowkit/tokens)
[![license](https://img.shields.io/npm/l/@rowkit/tokens)](https://github.com/NikolaiKushner/rowkit/blob/main/LICENSE)

The design tokens behind [rowkit](https://www.npmjs.com/package/rowkit) — colour, shadows, sizes, corners, type, layers and motion for its two themes: **Windows 98**, the default, and **modern**, in light and dark. Plus `defineTheme()`, to make a theme of your own.

Usable on its own. Nothing here depends on Vue, so a chart library, a design tool or an email template can read the same values the components use.

**[Live reference](https://rowkit.dev/foundations/tokens)** · **[GitHub](https://github.com/NikolaiKushner/rowkit)**

## Install

```bash
npm i @rowkit/tokens@beta
```

## Two layers

**Primitives** are the raw palette — the VGA colours and Windows 98's system colours: `--color-vga-navy` is one specific blue and means nothing on its own. **Semantic** tokens name a role — `--color-card`, `--color-muted-foreground`, `--color-border` — and point at a primitive through `var()`.

Rebranding is a matter of repointing semantic references rather than hunting hex codes. The modern theme has a palette of its own (`--color-modern-*`) and points the same semantic names at it, once for light and once for dark.

## Use

As a Tailwind v4 theme:

```css
@import 'tailwindcss';
@import '@rowkit/tokens/css';
```

Every token becomes a theme value, so `bg-card`, `text-ui`, `p-4` and `shadow-raised` resolve to the scales above. The stylesheet also carries both themes. Pick one with an attribute on any element; themes nest:

```html
<html data-theme="modern" data-color-scheme="dark"></html>
```

Without `data-theme` a page is Windows 98. Without `data-color-scheme` the modern theme follows the system's light or dark setting.

As CSS custom properties, for anything Tailwind does not cover:

```css
.my-thing {
  background: var(--color-muted);
  border-radius: var(--radius-md);
}
```

Or in TypeScript, fully typed, when a value has to reach JavaScript:

```ts
import { tokens } from '@rowkit/tokens'

tokens.color.vga.silver // '#c0c0c0' — the face of every window

const series = [tokens.color.vga.navy, tokens.color.vga.green, tokens.color.vga.maroon]
```

`tokens` is grouped by scale rather than flattened, so `tokens.color.vga.navy` narrows to its literal type and autocompletes at every level. The scales are Windows 98's values.

## Themes as data

`tokens.themes` has each theme as the CSS variables it declares — every value a theme may set, by name:

```ts
import { tokens } from '@rowkit/tokens'

tokens.themes.win98['--spacing-control-md'] // '28px'
tokens.themes.modern.light['--spacing-control-md'] // '32px'
tokens.themes.modern.dark // only what the dark scheme changes
```

## A theme of your own

`defineTheme()` starts from `modern` (the default) or `win98`, lays your values over it and returns the stylesheet — every variable declared, and for a theme with a dark scheme, the dark rules too, following the system unless `data-color-scheme` fixes it. A token name rowkit does not have throws, so a typo fails the build.

```ts
import { defineTheme } from '@rowkit/tokens'

export const acme = defineTheme({
  name: 'acme', // <html data-theme="acme">
  extends: 'modern',
  light: { '--color-control-primary': '#5b3df5', '--radius-md': '10px' },
  dark: { '--color-control-primary': '#7c66ff' },
})
```

Write the string to a file imported after `rowkit/styles`, or into a `<style>` element at start-up. `themeRule(selector, scheme, values)` writes one rule, if you would rather assemble the stylesheet yourself:

```ts
import { themeRule, tokens } from '@rowkit/tokens'

themeRule('.print', 'light', { ...tokens.themes.win98, '--color-background': '#ffffff' })
```

The whole guide, with a live builder: [Themes](https://rowkit.dev/foundations/themes).

## Reference

`@rowkit/tokens/reference` describes every token a theme sets: what it is for, which components read it, and its value in Windows 98 and in modern light and dark. A separate entry point, so the main one stays small.

```ts
import { tokenReference } from '@rowkit/tokens/reference'

tokenReference.find((t) => t.name === '--color-control-primary')
// { name, group: 'color', description: '…', components: ['Button'], values: { win98, modernLight, modernDark } }
```

## Notes on the values

**Windows 98's colour is the exact Windows 98 palette.** Primitives are `#rrggbb` values from the VGA palette and the default Windows 98 scheme, named as in the design's Figma variables. The modern palette follows the designer's Figma file.

**Depth: bevels in Windows 98, soft shadows in modern.** In Windows 98, `shadow-raised`, `shadow-sunken`, `shadow-window` and the rest are hard inset lines in the four `bevel-*` colours. The modern theme sets the same names to soft shadows outside the box and hairline edges.

**Corners: square in Windows 98, rounded in modern.** In Windows 98 the radius scale multiplies `--radius`, which is `0rem` until you set it. The modern theme sets each step as a length: 7px for a button or a field, 12px for a window.

**Type: PT Sans and VT323 in Windows 98, the system's faces in modern.** Both set the interface at 13px (`text-ui`) — in Windows 98, its 8pt at Large Fonts. Windows 98 has two weights, regular and bold; modern's emphasis (`--font-weight-strong`) is semibold. The font files are not shipped: for Windows 98, load `@fontsource/pt-sans` and `@fontsource/vt323` in the app. The modern theme loads nothing.

**Motion: next to none in Windows 98, short in modern.** Windows 98 changes state at once; the modern theme uses transitions of 120–160ms.

**Contrast is asserted, not claimed.** Every semantic text pairing is checked against WCAG AA, and every control boundary and focus ring against 3:1, in every theme and scheme, in the package's own tests.

**Spacing keys are multiples of 4px.** `4` is 1rem, `2` is 8px — the convention most Vue and Tailwind developers already carry.

**Layer order is a build gate.** `z-index.test.ts` asserts a modal sits above an overlay, a tooltip above everything, and that consecutive layers stay at least 100 apart.

## License

MIT © Nikolai Kushner

The Windows 98 theme is a tribute to Windows 98. rowkit is not affiliated with or endorsed by Microsoft.
