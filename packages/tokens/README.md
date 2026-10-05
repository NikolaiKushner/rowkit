# @rowkit/tokens

[![npm](https://img.shields.io/npm/v/@rowkit/tokens/beta?color=000080)](https://www.npmjs.com/package/@rowkit/tokens)
[![license](https://img.shields.io/npm/l/@rowkit/tokens)](https://github.com/NikolaiKushner/rowkit/blob/main/LICENSE)

The design tokens behind [rowkit](https://www.npmjs.com/package/rowkit) — the Windows 98 palette, bevels, type, spacing, radii, layers and motion.

Usable on its own. Nothing here depends on Vue, so a chart library, a design tool or an email template can read the same values the components use.

**[Live reference](https://rowkit.dev/foundations/tokens)** · **[GitHub](https://github.com/NikolaiKushner/rowkit)**

## Install

```bash
npm i @rowkit/tokens@beta
```

## Two layers

**Primitives** are the raw palette — the VGA colours and Windows 98's system colours: `--color-vga-navy` is one specific blue and means nothing on its own. **Semantic** tokens name a role — `--color-card`, `--color-muted-foreground`, `--color-border` — and point at a primitive through `var()`.

Rebranding is a matter of repointing semantic references rather than hunting hex codes. There is one theme; rowkit has no dark mode.

## Use

As a Tailwind v4 theme:

```css
@import 'tailwindcss';
@import '@rowkit/tokens/css';
```

Every token becomes a theme value, so `bg-card`, `text-ui`, `p-4` and `shadow-raised` resolve to the scales above.

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

`tokens` is grouped by scale rather than flattened, so `tokens.color.vga.navy` narrows to its literal type and autocompletes at every level.

## Notes on the values

**Colour is the exact Windows 98 palette.** Primitives are `#rrggbb` values from the VGA palette and the default Windows 98 scheme, named as in the design's Figma variables.

**Depth is bevels, not elevation.** `shadow-raised`, `shadow-sunken`, `shadow-window` and the rest are hard inset lines in the four `bevel-*` colours. Corners are square: the radius scale multiplies `--radius`, which is `0rem` until you set it.

**Type is PT Sans and VT323.** The interface is set at 11px (`text-ui`). The font files are not shipped; load `@fontsource/pt-sans` and `@fontsource/vt323` in the app.

**Contrast is asserted, not claimed.** Every semantic text pairing is checked against WCAG AA, and every control boundary and focus ring against 3:1, in the package's own tests.

**Spacing keys are multiples of 4px.** `4` is 1rem, `2` is 8px — the convention most Vue and Tailwind developers already carry.

**Layer order is a build gate.** `z-index.test.ts` asserts a modal sits above an overlay, a tooltip above everything, and that consecutive layers stay at least 100 apart.

## License

MIT © Nikolai Kushner

The visual language is a tribute to Windows 98. rowkit is not affiliated with or endorsed by Microsoft.
