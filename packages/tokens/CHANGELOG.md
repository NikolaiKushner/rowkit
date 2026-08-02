# @rowkit/tokens

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
