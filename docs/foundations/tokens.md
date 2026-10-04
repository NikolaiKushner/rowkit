# Tokens

Every colour, space, radius, shadow and layer in rowkit is a token. Nothing on
this page is hand-maintained — the swatches below are rendered from
`@rowkit/tokens`, so the reference cannot drift from the package.

**Click any token name to copy it.**

<script setup>
import { tokens } from '@rowkit/tokens'

const families = ['vga', 'win98']
</script>

```bash
pnpm add @rowkit/tokens
```

The package has no dependency on Vue, so a chart library, a design tool or an
email template can read the same values the components use.

```ts
import { tokens } from '@rowkit/tokens'

tokens.color.vga.silver // '#c0c0c0'
```

## Two layers, and why it matters

**Primitives** are the raw palette: `--color-vga-navy` is one specific blue and
means nothing on its own. **Semantic** tokens name a role — `--color-card`,
`--color-muted-foreground`, `--color-border` — and point at a primitive through
`var()`.

Components only ever reference the semantic layer. That is what makes a rebrand
a matter of repointing references rather than hunting hex codes, and it is
enforced in the package's own tests rather than left as a convention.

## Colour primitives

The palette Windows 98 was drawn in: the VGA colours, plus the few system
colours its default scheme added — the light bevel grey, the ends of the
title-bar gradients and the tooltip yellow. They are kept as exact `#rrggbb`
values. These colours are defined by their eight-bit channels, and converting
them to another colour space would only add rounding to values that are already
exact.

The names match the Figma file's variables, so `vga/silver` in the design is
`--color-vga-silver` here.

<ColorScale v-for="family in families" :key="family" :name="family" :scale="tokens.color[family]" />

## Semantic colours

These are the ones to reach for. Windows 98 is a grey world: most surfaces share
one silver, and depth comes from bevels rather than from a lighter or darker
fill. Several surface tokens therefore point at the same primitive. They stay
separate because they are separate override points — a theme that wants a
hovered row to change colour repoints `accent` and nothing else.

<TokenGrid :tokens="tokens.color.semantic" prefix="--color">
  <template #preview="{ token }">
    <span
      class="inline-block h-6 w-16 rounded-sm border border-border align-middle"
      :style="{ background: `var(--color-${token})` }"
    ></span>
  </template>
</TokenGrid>

There is one theme, so there is one map. Contrast for every pairing is asserted
in the package's tests — the ratios are a build gate, not a claim in a comment.

## Spacing

Keys are multiples of a 4px base, which is the convention most Vue and Tailwind
developers already carry in their heads: `4` is 1rem, `2` is 8px.

The low end is dense deliberately. A table cell padded at `2`/`3` is the
difference between a grid showing twenty rows and one showing twelve.

<TokenGrid :tokens="tokens.spacing" prefix="--spacing">
  <template #preview="{ value }">
    <span class="inline-block h-4 bg-primary-solid align-middle" :style="{ width: value }"></span>
  </template>
</TokenGrid>

## Radii

Every corner is square: Windows 98 draws no rounded corners, and every radius
in the design is 0. The scale is still there, built on one `--radius` length
that defaults to `0rem`. Set `--radius` and every control gets corners in
proportion, without touching a component. `full` stays a circle, for the radio
button and a round skeleton.

<TokenGrid :tokens="tokens.radius" prefix="--radius">
  <template #preview="{ value }">
    <span
      class="inline-block size-10 border border-border bg-muted align-middle"
      :style="{ borderRadius: value }"
    ></span>
  </template>
</TokenGrid>

## Bevels

Windows 98 has no elevation. Depth is drawn with bevels: two 1px lines on each
side of a box, light on the top-left and dark on the bottom-right for a raised
surface, and the other way round for a sunken one. Each bevel is a stack of hard
inset shadows built from the four `bevel-*` colours. There is no blur, and the
frame sits inside the box, so it never changes the box's size.

<TokenGrid :tokens="tokens.shadow" prefix="--shadow">
  <template #preview="{ value }">
    <span
      class="inline-block size-10 bg-card align-middle"
      :style="{ boxShadow: value }"
    ></span>
  </template>
</TokenGrid>

Disabled text has a shadow of its own. Windows 98 shows a disabled control by
drawing its text grey with a white copy one pixel right and down, never by
fading it with opacity.

<TokenGrid :tokens="tokens.textShadow" prefix="--text-shadow">
  <template #preview="{ value }">
    <span class="align-middle text-text-disabled" :style="{ textShadow: value }">Disabled</span>
  </template>
</TokenGrid>

## Type

The interface is set at Windows 98's own 11px in **PT Sans**, the closest open
face to Tahoma. Documentation paragraphs run at 15px. Code and fixed-width
numbers use **VT323**, drawn after the Fixedsys terminal font. The sizes are
named after the design's text styles: `ui/body` is `text-ui`, `doc/h1` is
`text-doc-h1`.

<TokenGrid :tokens="Object.fromEntries(Object.entries(tokens.font.size).map(([k, v]) => [k, `${v.size} / ${v.lineHeight}`]))" prefix="--text">
  <template #preview="{ token }">
    <span class="align-middle" :class="`text-${token}`" :style="token === 'mono' ? { fontFamily: 'var(--font-mono)' } : undefined">Ag Яя 123</span>
  </template>
</TokenGrid>

Two weights, `normal` and `bold`, because PT Sans has two. A weight in between
would be faked by the browser, and a faked weight is blurrier than either real
one.

rowkit does not ship the font files. Load them in the app:

```bash
pnpm add @fontsource/pt-sans @fontsource/vt323
```

```css
@import '@fontsource/pt-sans/400.css';
@import '@fontsource/pt-sans/700.css';
@import '@fontsource/vt323/400.css';
```

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

Windows 98 barely animates, so these are rarely needed. Durations are short by
intent. An interface that a person uses for six hours a
day should acknowledge input, not perform. Anything ambient — a skeleton pulse,
a toast sliding in — is additionally gated behind `motion-safe:`, so it is
absent entirely for anyone who has asked for reduced motion.

## Using them

Through Tailwind, which is the normal path — every token is a theme value, so
`bg-card`, `text-ui`, `p-4` and `shadow-raised` all resolve to the tokens
above:

```vue
<div class="bg-card p-4 text-ui shadow-window">…</div>
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

const series = [tokens.color.vga.navy, tokens.color.vga.green, tokens.color.vga.maroon]
```
