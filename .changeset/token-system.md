---
'@rowkit/tokens': minor
---

Add the token system.

Eleven-step colour ramps for neutral, primary, success, warning and danger, all
sharing one lightness curve so `primary-600` and `danger-600` carry the same
perceptual weight. A semantic layer on top — surfaces, text, borders, focus ring,
status families — where every token points at a primitive through `var()` rather
than holding a colour of its own, so re-theming means repointing references.
Dark mode overrides the semantic layer only; primitives stay fixed.

Also spacing, typography with paired line heights, radii, shadows mixed from a
semantic shadow colour, stacking layers, and motion durations and easings.

Ships as a typed TS object (`import { tokens } from '@rowkit/tokens'`) and a
Tailwind v4 `@theme` block (`@rowkit/tokens/css`), with the CSS generated from
the TS so the two cannot drift. Contrast for every pairing components can
produce is asserted as a build gate rather than claimed in a comment.

_Recorded retroactively — this work predates Changesets being installed._
