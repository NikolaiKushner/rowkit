# @rowkit/tokens

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
