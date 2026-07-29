# Roadmap

This file is the scope contract. **Twelve components for v1.0 — nothing else.**

Anything not on this list goes under "Considered, not planned" at the bottom. If an idea is good enough to build, it earns a place in a future major version, not a detour in this one.

---

## Component stages

Every component is labeled with its current stage. Nothing is marked Stable until it meets the full definition of done.

| Stage | Meaning |
|---|---|
| 🔴 **Not started** | — |
| 🟡 **Experimental** | Renders, has a story, API may still change |
| 🟢 **Stable** | Full API documented, tested, a11y verified, keyboard support, dark mode |
| 🔒 **Locked** | Stable, and no breaking changes without a major version |

**Definition of done for Stable:**
1. Renders all variants correctly in light and dark mode
2. Full keyboard support, documented
3. `addon-a11y` passes with zero violations
4. Props typed and JSDoc'd
5. Stories cover every variant and state
6. Interaction test for primary behavior
7. Docs page written, including "when not to use"

---

## v1.0 scope

### Foundations

- [x] 🟢 **Button** — variants, sizes, loading state, icon slots
- [x] 🟢 **Input / Field** — label, hint, error, required, disabled
- [x] 🟢 **Select** — searchable, keyboard nav, async options
- [x] 🟢 **Badge** — status semantics (success / warning / danger / neutral)

### Data layer

- [ ] 🔴 **DataTable** — typed column defs, sorting, row selection, sticky header
- [ ] 🔴 **TablePagination** — page size, jump-to-page, total count
- [ ] 🔴 **FilterBar** — composable filter chips with applied-state display
- [x] 🟢 **EmptyState** — the screen every dashboard needs and nobody designs
- [x] 🟢 **Skeleton** — loading placeholders matched to the data components

### Overlay & feedback

- [ ] 🔴 **Dialog** — focus trap, scroll lock, escape handling
- [ ] 🔴 **Toast** — queue management, variants, auto-dismiss
- [ ] 🔴 **Tooltip** — delay, placement, touch behavior

---

## Build phases

- [x] **Phase 0 — Foundation.** Monorepo, Vite library mode, TypeScript strict, ESLint, Vitest, CI.
      *Done when:* a throwaway component builds, emits correct `.d.ts`, and imports with working types in the playground.

- [x] **Phase 1 — Token system.** Color scales, semantic mappings, spacing, typography, radii, shadows, z-index, motion. Dark mode. Standalone `@rowkit/tokens` package.
      *Done when:* dark mode toggles with zero hardcoded colors anywhere, and `import { tokens } from '@rowkit/tokens'` is fully typed.

- [x] **Phase 2 — Core components.** The four foundations, one at a time, each fully complete before the next.
      *Done when:* all four at Stable, playground renders a working form using only rowkit components.

- [ ] **Phase 3 — Data layer.** The five data components. DataTable is the centerpiece.
      *Done when:* playground has a working "users admin" page — filterable, sortable, paginated, with loading and empty states.

- [ ] **Phase 4 — Overlays.** Dialog, Toast, Tooltip. SSR-safe.
      *Done when:* all three keyboard-navigable, focus-managed, no hydration errors in the Nuxt playground.

- [ ] **Phase 5 — Documentation site.** VitePress on rowkit.dev. Foundations, components, patterns, contributing.
      *Done when:* every Stable component documented, Storybook deployed and linked.

- [ ] **Phase 6 — Ship.** Changesets, trusted publishing via GitHub Actions, `v0.1.0` on npm.
      *Done when:* `npm i rowkit` works in a fresh project, following only the docs.

---

## Considered, not planned

Ideas that are reasonable but explicitly out of scope for v1.0. Recording them here is how they stay out of the current milestone.

- Date picker / date range picker
- Rich text editor
- Charts (better served by a dedicated library)
- Command palette
- Form validation layer (rowkit provides field states; validation is the app's job)
- Virtualized list beyond DataTable
- Figma kit
- React port

---

## Non-goals

- **Not a general-purpose UI library.** If you need forty components covering every case, use Nuxt UI or shadcn-vue. rowkit is deliberately narrow.
- **Not a CSS framework.** Tailwind v4 is a peer dependency, not something rowkit replaces.
- **Not opinionated about data fetching.** Components take props; where the data comes from is yours.
