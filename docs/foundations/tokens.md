# Tokens

Every colour, space, radius, shadow and layer in rowkit is a token. Nothing on
this page is hand-maintained — the swatches below are rendered from
`@rowkit/tokens`, so the reference cannot drift from the package.

**Click any token name to copy it.**

<script setup>
import { tokens } from '@rowkit/tokens'

const families = ['neutral', 'primary', 'success', 'warning', 'danger']
</script>

```bash
pnpm add @rowkit/tokens
```

The package has no dependency on Vue, so a chart library, a design tool or an
email template can read the same values the components use.

```ts
import { tokens } from '@rowkit/tokens'

tokens.color.primary[600] // 'oklch(0.546 0.209 259)'
```

## Two layers, and why it matters

**Primitives** are the raw ramps: `--color-primary-600` is one specific blue and
means nothing on its own. **Semantic** tokens name a role — `--color-card`,
`--color-muted-foreground`, `--color-border` — and point at a primitive through
`var()`.

Components only ever reference the semantic layer. That is what makes dark mode
a matter of repointing references rather than hunting hex codes, and it is
enforced in the package's own tests rather than left as a convention.

## Colour primitives

Eleven steps per family, sharing one lightness ramp so `primary-600`,
`danger-600` and `success-600` carry the same perceptual weight and can be
swapped without relayering a design.

Chroma is clamped to the sRGB gamut on purpose. OKLCH can express colours
outside it, and browsers gamut-map those by their own rules — which makes a
token render differently on a P3 laptop than on an sRGB monitor. Clamping trades
a little vividness for identical output everywhere.

<ColorScale v-for="family in families" :key="family" :name="family" :scale="tokens.color[family]" />

## Semantic colours

These are the ones to reach for. The swatch shows the token as this page is
currently rendering it — **toggle the site's theme and every swatch here changes
while the primitives above stay put.** That is the whole design in one
interaction.

<TokenGrid :tokens="tokens.color.semantic.light" prefix="--color">
  <template #preview="{ token }">
    <span
      class="inline-block h-6 w-16 rounded-sm border border-border align-middle"
      :style="{ background: `var(--color-${token})` }"
    ></span>
  </template>
</TokenGrid>

The `light` and `dark` maps hold the same keys by construction, so there is no
token that exists in one theme and not the other. Contrast for every pairing is
asserted in the package's tests — the ratios are a build gate, not a claim in a
comment.

## Spacing

Keys are multiples of a 4px base, which is the convention most Vue and Tailwind
developers already carry in their heads: `4` is 1rem, `2` is 8px.

The low end is dense deliberately. A table cell padded at `2`/`3` is the
difference between a grid showing twenty rows and one showing twelve.

<TokenGrid :tokens="tokens.spacing" prefix="--spacing">
  <template #preview="{ value }">
    <span class="inline-block h-4 bg-primary-500 align-middle" :style="{ width: value }"></span>
  </template>
</TokenGrid>

## Radii

Restrained by design: heavily rounded corners waste horizontal space at the
edges of a dense grid, and make adjacent cells read as separate objects rather
than one table.

<TokenGrid :tokens="tokens.radius" prefix="--radius">
  <template #preview="{ value }">
    <span
      class="inline-block size-10 border border-border bg-muted align-middle"
      :style="{ borderRadius: value }"
    ></span>
  </template>
</TokenGrid>

## Shadows

Each shadow mixes from `--color-shadow`, itself a semantic token, rather than
hardcoding a colour.

Dark mode leans on surface lightness for elevation instead of on shadows. A
shadow is a darker region, and on a near-black page there is very little
headroom left to darken — so the raised surface colour does that work.

<TokenGrid :tokens="tokens.shadow" prefix="--shadow">
  <template #preview="{ value }">
    <span
      class="inline-block size-10 rounded-sm bg-card align-middle"
      :style="{ boxShadow: value }"
    ></span>
  </template>
</TokenGrid>

## Layers

Stacking order is a token scale, not a set of numbers chosen at each call site.
The gaps are wide enough that an application can slot its own layer between two
of rowkit's without editing either.

The order itself is a build gate: `z-index.test.ts` asserts that a modal sits
above an overlay, a tooltip above everything, and that consecutive layers stay
at least 100 apart.

<TokenGrid :tokens="tokens.zIndex" prefix="--z-index" />

Note the namespace. Tailwind v4 reads `--z-index-*`, not `--z-*`, and a token
written into the wrong namespace generates **no utility and no error** — it
simply does nothing. That is not a hypothetical: it happened here, and
`styles/variants.test.ts` exists because of it.

## Motion

<TokenGrid :tokens="tokens.motion.duration" prefix="--transition-duration" />

<TokenGrid :tokens="tokens.motion.easing" prefix="--ease" />

Durations are short by intent. An interface that a person uses for six hours a
day should acknowledge input, not perform. Anything ambient — a skeleton pulse,
a toast sliding in — is additionally gated behind `motion-safe:`, so it is
absent entirely for anyone who has asked for reduced motion.

## Using them

Through Tailwind, which is the normal path — every token is a theme value, so
`bg-card`, `text-muted-foreground`, `p-4`, `rounded-md` and `shadow-lg` all resolve
to the tokens above:

```vue
<div class="rounded-md bg-card p-4 shadow-sm">…</div>
```

Or directly, as CSS custom properties, for anything Tailwind does not cover:

```css
.my-thing {
  background: var(--color-muted);
  border-radius: var(--radius-md);
}
```

Or in TypeScript, fully typed, when a value has to reach JavaScript — a chart
library's colour array, a canvas, a generated image:

```ts
import { tokens } from '@rowkit/tokens'

const series = [tokens.color.primary[500], tokens.color.success[500]]
```
