# @rowkit/tokens

## 0.2.0

### Minor Changes

- 164ca88: Restyle rowkit on a shadcn/ui-derived language, then tune it for data-dense SaaS — cool chrome, indigo primary, one control geometry.

  **Tokens (breaking if you override theme variables or write rowkit utility classes by hand).** Seven core semantics rename to shadcn’s names: `surface` → `card`, `surface-subtle` → `muted`, `surface-hover` → `accent`, `text` → `foreground`, `text-muted` → `muted-foreground`, `border-control` → `input`, `focus-ring` → `ring`. The greys start from shadcn’s zero-chroma ramp, then pick up rowkit identity: cooler, lighter decorative borders, a cool off-white page, brand indigo primary with a matching focus ring (not near-black), and selected rows on a quiet primary wash. Corners derive from a single `--radius`. New: overlay blur, sticky-header inset shadow, stronger sticky-column scroll shadow. Status families keep the solid/subtle/outline axis Badge and Button already expose.

  **Components.** The shared focus recipe (border + translucent ring) lands on every control. Button, Input and Select share height, radius, padding and `text-sm` from `sm` up; Button adds `xs` and `icon`. Secondary is a muted fill so it never reads as another field; fields stay the outlined hollow shell. Chromatic Badge `subtle` is a soft tinted chip. Tooltip inverts foreground/background instead of painting as a primary bubble. DataTable: opaque sticky header with an inset edge that travels while scrolling, unified loaded/loading row heights, quieter hover vs selection. Dialog: blurred scrim, denser padding, footer rule, close matches an icon button. FilterBar, Field, Toast, EmptyState and Pagination follow the same chrome. Docs demos stop inheriting VitePress’s unlayered table grid and zebra over DataTable.

  **API (0.x breaking).** `TablePagination` is now `Pagination` — same props, events and slots; docs move to `/components/pagination`. Marked `minor` on purpose: on a 0.x line changesets would turn a `major` into `1.0.0`, and 1.0 should wait for real apps, not a rename.

## 0.1.1

### Patch Changes

- a4280d4: Fix types failing to resolve under `moduleResolution: node16` and `nodenext`.

  The emitted declarations carried extensionless relative specifiers — `from
'./components/Badge'`, `from './Badge.variants'` — and a directory import cannot
  be resolved by Node's ESM resolver. Anyone on `bundler` (Vite, Nuxt) was
  unaffected; everyone else saw the package as untyped.

  The build now rewrites those specifiers to end in `.js`. No API change, and the
  JavaScript output is untouched.

- 60f2021: Add a README to each package.

  Both npm pages were blank. npm publishes the README that sits beside
  `package.json`, not the one at the root of a monorepo — so the repository README
  was never reaching the surface that matters most for a package nobody has heard
  of yet.

  Each package now has its own, aimed at someone deciding whether to install it:
  the setup step people miss, a typed `DataTable` example, and what the library
  deliberately is not.

## 0.1.0

### Minor Changes

- 7d401a0: Add the token system: eleven-step colour ramps on a shared lightness curve, a semantic layer where every token points at a primitive through `var()` so re-theming means repointing references, plus spacing, typography, radii, shadows, stacking layers and motion. Ships as a typed TS object and a Tailwind v4 `@theme` block generated from it, with contrast for every pairing asserted as a build gate.

  _Recorded retroactively — this work predates Changesets being installed._

### Patch Changes

- 6d7b4e4: Fix the exported `version` constant reporting `0.0.0` on a released build.

  Both packages exported a hand-written literal that a test pinned against
  `package.json`. Changesets bumps the manifest and nothing updated the literal,
  so the first release failed its own test — and had it passed, `version` would
  have reported `0.0.0` from a `0.1.0` package.

  It is now read from `package.json` directly, so the two cannot disagree. Rollup
  tree-shakes the import down to the single string; nothing else from the manifest
  ships.
