# Phase 0b — Workshop Tooling

**Status:** ✅ complete — Storybook and playground landed first; Changesets, size-limit, `docs/conventions.md` and `docs/decisions/` closed the gap afterwards. This file is the closure spec and the record of what actually shipped.
**Deliverable:** every tool that later phases' Definitions of Done depend on
**Effort:** ~6h original + ~2h closure

The organizing rule of this phase — written after violating it twice — is: **nothing a later phase's DoD depends on gets installed later than the phase that needs it.** The component DoD requires stories, an a11y pass, and a changeset; therefore Storybook, addon-a11y, and Changesets are Phase 0b, not "later."

---

## Scope

### Landed ✅

- **Storybook 10** with `@storybook/addon-vitest` (stories double as browser-mode Vitest tests via Playwright) and `@storybook/addon-a11y`, configured as a **gate** (`a11y: { test: 'error' }`) rather than a panel — a violation fails `pnpm test`

  > Storybook **10**, not the 9 this phase originally specified and `CLAUDE.md` still names. `@storybook/vue3-vite@9` peers on Vite 7 and this repo is on Vite 8; downgrading Vite to keep Storybook 9 was the worse trade. `CLAUDE.md`'s Stack section is still wrong on this point.

- Playground confirmed running against workspace packages

### The closure work — landed ✅

**1. Changesets**

```bash
pnpm add -Dw @changesets/cli
pnpm changeset init
```

Config decisions, made now:

- `.changeset/config.json`: `"fixed": [["rowkit", "@rowkit/tokens"]]` — the two packages always share a version; independent versioning is overhead for two packages that release together
- `"access": "public"` in the config's publish defaults

**Retroactive changesets** — the ledger must be complete before Phase 3 adds five more entries. One changeset per already-built component and one for the token package, each honestly describing the API it introduced, all `minor`. This is reconstruction, so keep each to two sentences; the goal is a v0.1.0 changelog that starts at the beginning of the story, not the middle.

**2. size-limit in CI**

```bash
pnpm add -Dw size-limit @size-limit/preset-small-lib
```

Budgets (from plan v2, recorded here as the enforcement point):

- Core four components: **≤ 15 KB** min+gzip, excluding Vue and Reka UI
- Full library: **≤ 45 KB** min+gzip

Added as a CI step after build. A budget that isn't checked is decoration; a budget in CI is a regression alarm. Expect to revisit the numbers once — the first real measurement calibrates them; after that they only ratchet with justification in a PR.

> **Calibration, as anticipated — and a unit change.** `size-limit` 13 has no gzip mode: `brotli: false` disables compression entirely rather than falling back. Measurements are therefore **brotli**, which runs roughly 10–15% under gzip, so the figures above are not directly comparable to what CI prints. Calibrated ceilings live in `.size-limit.json`; the full library measured **9.56 kB** against a 14 kB ceiling with nine components built.
>
> A third entry imports **one component** and holds it under 3.5 kB. That is the entry that earns its keep: it fails when a barrel change breaks tree-shaking, which no total-size budget can detect.

**3. `docs/conventions.md`**

The API conventions, written before they're needed at scale (full text lives in plan v2; summary):

- Boolean props are adjectives, no `is` prefix: `disabled`, `loading`
- Variants are strings, never booleans: `variant="danger"`
- One size scale everywhere: `sm | md | lg`, default `md`
- Every component accepts `class`, merged via `tailwind-merge`
- Events past-tense; `update:modelValue` for v-model; payloads are values, not DOM events, unless the DOM event is the point
- Slots: `default` for content; named slots describe **role** (`#controls`, `#empty`), not position — corrected from `#leading` per the Phase 3 audit
- Every component exports its props type; generics named for the domain (`DataTable<TRow>`)

**4. `docs/decisions/` directory**

Created per the Phase 3 audit finding that "results living in the PR evaporate." Short numbered files (ADR-lite): `001-typescript-pin.md`, `002-no-project-references.md` migrate from CLAUDE.md prose; Phase 3 adds `003-cell-slot-typing.md` and `004-datatable-performance.md`. Two paragraphs each: the decision, the reasons, the revisit condition. PRs link here; the repo retains.

---

## CI after closure

Full gate, in order: **`build → lint → format:check → typecheck → test → size → build-storybook`**.

> **Build runs first, not second-to-last.** An earlier draft of this section put Build late, treating it as the slowest gate. That ordering is not available to this repo, and the reason is [002 — no `tsc` project references](../decisions/002-no-project-references.md): packages resolve each other through their built `dist`, so on a clean checkout **lint and typecheck cannot resolve a workspace import until it has been built**.
>
> This was not hypothetical. CI ran Lint first and failed with 24 errors that said nothing about the code: with no `dist`, every import of `@rowkit/tokens` and `rowkit` types as `error`, and the type-aware rules report each use as unsafe. Ordering Build first was the fix, and it is verified — the same 24 errors reproduce on demand by deleting `dist` and running lint.
>
> `size` still runs on build output, and stays late.

---

## Definition of Done

- [x] `pnpm storybook` runs; a story renders; addon-a11y reports on it
- [x] Stories execute as Vitest browser tests
- [x] `pnpm changeset` produces a file; fixed-versioning config committed
- [x] Retro-changesets for all shipped API surface, dated honestly
- [x] size-limit in CI, budgets green (recalibrated to brotli — see above)
- [x] `docs/conventions.md` merged
- [x] `docs/decisions/` exists with the two migrated ADRs

**Phase 0b is closed.** Phase 3's five changesets remain outstanding and are owed with the Phase 3 tier-one work, not here — writing them now would describe APIs that work is about to change.

## Lessons recorded

1. **Storybook + addon-vitest is a heavy install** (browser-mode Vitest + Playwright binaries). Paid once, and it's the price of stories-as-tests. Pin the major; don't chase Storybook upgrades mid-phase.
2. **A tool's peer range can dictate a major version you didn't choose.** Storybook 9 was specified; Vite 8 made it unavailable. Check the peer ranges of the heaviest dependency before writing a version into a spec.
3. **`size-limit` 13 has no gzip mode.** A budget written in gzip cannot be enforced by the tool that enforces budgets. Units are part of a budget, and the spec's numbers silently meant something else than CI's.
4. The original plan scheduled Changesets for Phase 6 while CLAUDE.md hard rule 6 required changesets from the first API change — a direct contradiction discovered on the first real PR. The rule above ("nothing a DoD depends on installs later than the phase needing it") is the generalized fix, and it's also the first check when any phase "can't be finished": ask whether the blocker is the work or the plan.
