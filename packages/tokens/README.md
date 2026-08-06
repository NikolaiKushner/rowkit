# @rowkit/tokens

[![npm](https://img.shields.io/npm/v/@rowkit/tokens?color=3b5bdb)](https://www.npmjs.com/package/@rowkit/tokens)
[![license](https://img.shields.io/npm/l/@rowkit/tokens)](https://github.com/NikolaiKushner/rowkit/blob/main/LICENSE)

The design tokens behind [rowkit](https://www.npmjs.com/package/rowkit) — colour, spacing, typography, radii, shadows, layers and motion.

Usable on its own. Nothing here depends on Vue, so a chart library, a design tool or an email template can read the same values the components use.

**[Live reference](https://rowkit.dev/foundations/tokens)** · **[GitHub](https://github.com/NikolaiKushner/rowkit)**

## Install

```bash
npm i @rowkit/tokens
```

## Two layers

**Primitives** are the raw ramps: `--color-primary-600` is one specific blue and means nothing on its own. **Semantic** tokens name a role — `--color-card`, `--color-muted-foreground`, `--color-border` — and point at a primitive through `var()`.

Only the semantic layer changes under `.dark`, which is what makes dark mode a matter of repointing references rather than hunting hex codes.

## Use

As a Tailwind v4 theme:

```css
@import 'tailwindcss';
@import '@rowkit/tokens/css';
```

Every token becomes a theme value, so `bg-card`, `text-muted-foreground`, `p-4`, `rounded-md` and `shadow-lg` resolve to the scales above.

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

tokens.color.primary[600] // 'oklch(0.546 0.209 259)'

const series = [tokens.color.primary[500], tokens.color.success[500]]
```

`tokens` is grouped by scale rather than flattened, so `tokens.color.primary[600]` narrows to its literal type and autocompletes at every level.

## Notes on the values

**Colour is OKLCH, clamped to sRGB.** Every chromatic family shares one lightness ramp, so `primary-600`, `danger-600` and `success-600` carry the same perceptual weight. Chroma is clamped to the sRGB gamut on purpose: OKLCH can express colours outside it, and browsers gamut-map those by their own rules — which makes a token render differently on a P3 laptop than on an sRGB monitor.

**Contrast is asserted, not claimed.** Every semantic pairing is checked against WCAG AA in the package's own tests, in both themes.

**Spacing keys are multiples of 4px.** `4` is 1rem, `2` is 8px — the convention most Vue and Tailwind developers already carry.

**Layer order is a build gate.** `z-index.test.ts` asserts a modal sits above an overlay, a tooltip above everything, and that consecutive layers stay at least 100 apart.

## License

MIT © Nikolai Kushner

Design language based on [shadcn/ui](https://ui.shadcn.com) by shadcn, adapted for Vue. shadcn/ui is MIT licensed; rowkit adopts its token values and class recipes, not its code.
