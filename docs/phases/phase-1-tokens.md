# Phase 1 — Tokens & Styling Architecture

**Status:** 🟡 token system complete and shipped; **two documentation deliverables outstanding** — see the DoD below. Corrected against the shipped package after the Phase 1 audit.
**Deliverable:** `@rowkit/tokens` as a standalone package, and a _verified_ answer to how styles reach a consumer
**Effort:** ~10h (2h spike + 8h tokens)

Two jobs, in a deliberate order: first prove the styling can be delivered at all, then build the token system on the proven foundation. The spike comes first because it's the one thing in the project that could invalidate everything built after it.

---

## 1. The styling-architecture spike (2h, first)

### The problem it de-risks

Tailwind generates CSS only for classes it can _see_, and it scans the consuming app's source — not `node_modules`, not a library's compiled `dist`. Naive packaging therefore ships components that render unstyled in every consumer. This is the hardest packaging question for a Tailwind-based library, and it was missing entirely from plan v1.

### The architecture (Option A — consumer compiles)

- rowkit's CSS entry contains **no** `@import "tailwindcss"` — that import belongs to the consumer alone; duplicating it produces two interfering sets of generated rules
- The entry carries the theme and points Tailwind at the library's own shipped files:

```css
/* packages/ui/src/styles/index.css */
@import '@rowkit/tokens/css';
@source './index.js';
```

> Export paths as shipped. The subpaths are `@rowkit/tokens/css` and
> `rowkit/styles` — **without** a `.css` suffix — and the `@source` points at
> the bundle rather than at `../../dist`, because the emitted stylesheet lives
> _inside_ `dist` and the relative path resolves from there.

- Consumer setup is two lines:

```css
@import 'tailwindcss';
@import 'rowkit/styles';
```

Tailwind then scans rowkit's `dist` as part of the consumer's build and generates exactly the classes in use — smallest output, consumer theme overrides apply naturally, no duplication.

Trade-offs accepted: a documented setup step exists (skipping it = unstyled components — this is the #1 seeded Troubleshooting entry), and `@source` into `node_modules` has known edge cases in sandboxed environments like StackBlitz. Option B (precompiled CSS for non-Tailwind consumers) remains additive later; recorded in the future roadmap, not built.

### The protocol (why "verified" is in the deliverable)

1. Build `packages/ui` with one throwaway styled component
2. Fresh Nuxt app **outside the monorepo**
3. Install the packed tarball
4. Follow the draft install docs _exactly_ — writing `docs/installation.md` during, not after
5. A styled component renders, or the phase stops here

Two hours if it works; if it doesn't, it just saved twelve components from a broken foundation. (Phase 6's stranger-test re-runs this against the real registry artifact.)

---

## 2. The token system (8h)

### Structure — tokens are the product, components are the delivery

`@rowkit/tokens` is a standalone package (the Polaris argument: tokens must be consumable by things that never import a Vue component — the docs site itself does exactly this). Two exports:

- `@rowkit/tokens/theme.css` — the Tailwind v4 `@theme` block
- `import { tokens } from '@rowkit/tokens'` — the same values as a fully typed TS object (feeds the docs' live swatches and any programmatic consumer)

One source generates both; they cannot drift.

### The scales

| Scale                | Shape                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Color, primitive** | 11 steps × 5 ramps: `neutral`, `primary`, `success`, `warning`, `danger`. Eleven because data-dense dark UIs need distinct values for surface/hover/border that 9-step ramps collapse                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Color, semantic**  | Surfaces `--color-surface` / `-subtle` / `-hover` / `-active` / `-selected` / `-disabled` (no `-raised`; the shipped family is state-based), text `--color-text` / `-muted` / `-subtle` / `-disabled`, borders `--color-border` / `-strong` / `-subtle` / `-control`, plus `--color-focus-ring`, `--color-shadow` and `--color-skeleton`. Each tone ships six: `-solid`, `-solid-hover`, `-on-solid`, `-subtle`, `-on-subtle`, `-border` — the `-on-*` pairs are what make contrast assertable as a build gate. **Semantic references primitive; nothing references a raw hex** — this is hard rule 1's enforcement point |
| **Spacing**          | 4px base progression                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Typography**       | sizes with _paired_ line-heights — never free-floating                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Radii / shadows**  | small closed sets. Shadows mix from `--color-shadow`, a semantic token, so dark mode repoints one variable. Dark mode then leans on **surface lightness** for elevation rather than on tuned shadows — on a near-black page there is very little headroom left to darken                                                                                                                                                                                                                                                                                                                                                  |
| **Z-index**          | named layers, emitted under Tailwind v4's `--z-index-*` namespace (not `--z-*`, which generates no utilities and no error). Ordered `base < sticky < dropdown < overlay < modal < popover < toast < tooltip`, spaced by 100. **Sticky sits below dropdown**, not above: a menu opened from a toolbar has to paint over a sticky table header. Popover above modal (a `Select` inside a `Dialog`) and toast above modal are both deliberate — Phase 4 depends on this ordering                                                                                                                                             |
| **Motion**           | durations + easings; overlays consume these in Phase 4. Short: ~150ms in, ~100ms out neighborhood                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### Dark mode

Overrides on `.dark` touch **semantic tokens only** — primitives never change. A component therefore never knows which theme is active; it reads `--color-surface` and the answer differs. This one constraint is what makes theme presets (future roadmap) nearly free later.

### Division of labor

The scale _values_ — ramp hues, step count, spacing base, what "muted" means — are taste decisions made by the maintainer, on paper, before implementation. The plumbing (generation, typing, the CSS emit, the docs table) is delegated work. This split repeats in every phase: **API and design decisions are the human's; mechanics are the agent's.**

---

## Definition of Done — met

- [x] Spike passed: styled component renders in a fresh external app from the packed tarball — verified against packed tarballs in a clean consumer project, with `@source` resolving into `node_modules/rowkit/dist`
- [x] Dark mode toggles with zero hardcoded values anywhere in the codebase
- [x] `import { tokens } from '@rowkit/tokens'` fully typed
- [x] `docs/installation.md` written, Troubleshooting seeded — **but after the spike, not during it.** The tarball install was verified first and the docs reconstructed later, in Phase 4, when the overlays needed an SSR section to live in. That is the wrong order and the Lessons below say why
- [x] `docs/foundations/tokens.md` lists every token — written in Phase 5, rendered from `tokens` rather than transcribed, so it cannot drift
- [x] Changeset (retro-written in Phase 0b closure if missed at the time)

## Lessons recorded

- Writing installation docs _during_ the spike, not after, is what made them true. Every install-doc that rots started as "I'll write it from memory."
- The `@theme`/TS dual export earned its cost immediately: the tokens docs page renders from the package, so it cannot drift — the same pattern Phase 5 extends to props tables.

- **A lesson recorded is not a lesson followed.** This file said to write the install docs _during_ the spike; the spike passed and the docs were never written. The DoD was then ticked from memory of the intent rather than from the repo — which is the same failure mode as results that live in a PR description.
- **Theme namespaces fail silently.** `--z-*` and `--duration-*` are not Tailwind v4 namespaces. A token declared under one produces no utility and no error, and it took a test that compiles the real stylesheet to notice. That test is now a build gate.
