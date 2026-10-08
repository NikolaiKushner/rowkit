# @rowkit/tokens

## 1.0.0-beta.0

### Major Changes

- fa23264: **rowkit 1.0 beta: the Windows 98 redesign.** Every component, the tokens and the documentation are redrawn in the style of Windows 98, and rowkit runs on its own behaviour layer. The entries below list each breaking change. This is the first 1.0 prerelease, published under the `beta` npm tag: install it with `pnpm add rowkit@beta`. The API may still change between betas; 1.0.0 is cut when it settles.

### Minor Changes

- f4b1653: **Breaking: dark mode is removed.** rowkit now has a single theme, the first step of the Windows 98 redesign. This is a breaking change released as a `minor` while rowkit is on 0.x.

  - The token stylesheet no longer emits a `.dark` block or redefines Tailwind's `dark:` variant. Setting `class="dark"` on `<html>` now does nothing; remove any theme toggle that relied on it. `dark:` utilities in your own code fall back to Tailwind's default `prefers-color-scheme` behaviour.
  - `semanticColorDark` and the `whiteAlpha` primitives (`--color-white-alpha-*`) are removed from `@rowkit/tokens`.
  - `semanticColorLight` is renamed to `semanticColor`, and `tokens.color.semantic` is now that map directly rather than `{ light, dark }`. Replace `tokens.color.semantic.light` with `tokens.color.semantic`.

- f4b1653: **Typeface: PT Sans replaces Geist.** `--font-sans` now leads with PT Sans, the closest open match to Tahoma, then Tahoma, Microsoft Sans Serif and Verdana. rowkit does not ship the font: add `@fontsource/pt-sans` and import its `400.css` and `700.css`. PT Sans covers Latin and Cyrillic. `--font-mono` now leads with Lucida Console, then Courier New. If you load `@fontsource-variable/geist` only for rowkit, you can drop it; to keep Geist, override `--font-sans` and `--font-mono`.
- 2611965: **Text is set in Windows 98's "Large Fonts" sizes.** At 96 DPI the system's 8pt is 11px, which was readable on a 1998 monitor's large pixels and is too small on today's screens; Windows 98 offered the 120 DPI "Large Fonts" mode for the same reason. The whole ladder moves with it:

  | token           | was   | now                                                    |
  | --------------- | ----- | ------------------------------------------------------ |
  | `text-ui`       | 11/13 | 13/16                                                  |
  | `text-heading`  | 13/16 | 16/20                                                  |
  | `text-mono`     | 16/16 | 16/16 — VT323 at 16px now matches 13px PT Sans exactly |
  | `text-doc`      | 15/24 | 16/26                                                  |
  | `text-doc-mono` | —     | 20/20, new: code beside documentation text             |
  | `text-doc-h1`   | 24/28 | 26/30                                                  |
  | `text-doc-h2`   | 18/22 | 19/24                                                  |
  | `text-doc-h3`   | 14/18 | 15/20                                                  |

  Bevels, borders and icons keep their pixel sizes, as they did in Windows 98.

- c82f79f: **The tokens are now the Windows 98 design.** Every value comes from the Figma file's variables and styles.

  - **Colour.** The primitives are the VGA palette and Windows 98's system colours as exact hex: `--color-vga-*` (`silver`, `gray`, `navy`, `teal`, …) and `--color-win98-*` (`light`, `dark-gray`, `title-blue`, `title-gray`, `info`). The OKLCH ramps (`neutral`, `primary`, `success`, `warning`, `danger`, `gray`, `red`, `green`, `amber`) and `colorSteps` are removed; `tokens.color.vga` and `tokens.color.win98` replace them. Semantic names are kept, and the design adds new ones: `desktop`, `tooltip-bg`, `text-disabled-emboss`, `on-selected`, `link`, `bevel-highlight` / `-light` / `-shadow` / `-dark`, and the `titlebar-*` gradient. `input` is now the white inside of a field, not a border colour.
  - **Bevels instead of elevation.** `shadow-raised`, `window`, `raised-default`, `pressed`, `sunken`, `status`, `etched` and `raised-thin` replace `shadow-xs` … `shadow-xl`. A new `text-shadow-disabled` draws the embossed disabled text.
  - **Square corners.** `--radius` defaults to `0rem`, so every `rounded-*` step is 0 until you set it; `rounded-full` is unchanged.
  - **Type.** Sizes are named after the design's text styles: `text-ui` (11/13), `text-heading`, `text-mono`, `text-doc`, `text-doc-h1` / `-h2` / `-h3`. The `xs` … `3xl` sizes, the `medium` and `semibold` weights and the `tight` and `wide` tracking are removed (Tailwind's defaults still answer to those names). `--font-mono` now leads with VT323; load `@fontsource/vt323` next to `@fontsource/pt-sans`.
  - **No backdrop blur.** The `blur` scale is removed, and the dialog backdrop no longer blurs.

  In rowkit, a selected DataTable row now has white text on navy, and an outline Badge has black text, as in the design. The rest of the components move to the new look in the next releases.

## 0.4.0

### Patch Changes

- ddefab7: **Tokens.** Default primary is ink blue (`oklch(0.32 0.09 255)` / `#0c335f`), not warm espresso. Selected rows and subtle primary washes follow the same hue, so they read cool instead of pink.

## 0.3.0

### Patch Changes

- aef7717: **Breaking (Button).** Variants are now `default` | `outline` | `secondary` | `ghost` | `destructive` | `link` — soft-ink solid is the default (omit `variant` or pass `default`). `primary` and `danger` are removed; soft `destructive` replaces solid danger. Size scale is `default` | `xs` | `sm` | `lg` | `icon` | `icon-xs` | `icon-sm` | `icon-lg`; the `icon` boolean prop is gone. Former bordered `secondary` is now `outline`; `secondary` is a muted fill (`surface-active`). Soft ink solid lightened to `oklch(0.26…)`. Link focus stays typographic (ring only). Dialog Cancel convention is `ghost` so soft Delete wins hierarchy.

  **ButtonGroup.** New `ButtonGroup` joins related buttons with shared edges (`orientation` horizontal | vertical). Nested groups use a clear gap.

  **Tokens.** Default primary is warm espresso graphite (`oklch(0.31 0.038 48)` / `#402a1f`), not near-black. Soft destructive wash in dark mirrors light (coloured label on a quiet red tint). Link focus is underline-only.

- a46fe24: **Tokens.** Default espresso primary nudged darker: `oklch(0.31 0.038 48)` / `#402a1f` (was `0.33` / `#462f24`).
- aef7717: Select shows a trailing checkmark on the selected option (shadcn-style) instead of a left indicator with a selected fill. Secondary buttons use a quiet `border-input` outline on a card surface. Dialog footers keep a hairline divider with Cancel as secondary. Resting control borders (`input`) are quieter. Focus is soft silver (`ring` → `gray-708` light / soft white dark) — border + translucent outer ring, not an ink halo.

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
