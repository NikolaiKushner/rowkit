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
- [x] 🟢 **Badge** — status semantics (neutral / primary / success / warning / danger), three appearances

### Data layer

- [x] 🟢 **DataTable** — typed column defs, sorting, row selection, sticky header
- [x] 🟢 **Pagination** — page size, jump-to-page, total count
- [x] 🟢 **FilterBar** — composable filter chips with applied-state display
- [x] 🟢 **EmptyState** — the screen every dashboard needs and nobody designs
- [x] 🟢 **Skeleton** — loading placeholders matched to the data components

### Overlay & feedback

- [x] 🟢 **Dialog** — focus trap, scroll lock, escape handling
- [x] 🟢 **Toast** — queue management, variants, auto-dismiss
- [x] 🟢 **Tooltip** — delay, placement, touch behavior

---

## Build phases

Planning docs live in `docs/phases/` when they exist. The previous phase specs
were retired; new ones will replace them.

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
