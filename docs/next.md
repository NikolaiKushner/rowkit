# What's next

The twelve components for v1 are built and Stable. The backlog lives in
[`NEXT.md`](https://github.com/NikolaiKushner/rowkit/blob/main/NEXT.md) in the
repository; this page is the readable version.

## Scope (unchanged)

**Twelve components. No thirteenth without an explicit decision in `NEXT.md`.**

| Area        | Components                                                                                                                                                                              |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundations | [Button](/components/button), [Field & Input](/components/field), [Select](/components/select), [Badge](/components/badge)                                                              |
| Data        | [DataTable](/components/data-table), [Pagination](/components/pagination), [FilterBar](/components/filter-bar), [EmptyState](/components/empty-state), [Skeleton](/components/skeleton) |
| Overlays    | [Dialog](/components/dialog), [Toast](/components/toast), [Tooltip](/components/tooltip)                                                                                                |

All twelve meet the definition of done. What remains before v1.0 is time and
real-world use: an API is not proven by its author.

## Working backlog

### Visual QA for agents

After any change that touches variants, tokens, layout, or dark mode, agents run
`pnpm visual:check`, open the PNGs, and fix what looks wrong. Unit tests and
`addon-a11y` are necessary; they are not sufficient for pixels.

### Consistency pass

Focus rings, size scale, dark mode, disabled / loading / empty / error — checked
across components, not one at a time in isolation. Density is judged on a real
table page (FilterBar + DataTable + Pagination).

### Real-world API pressure

Prefer friction from actual apps over inventing features. Lock APIs only after
that contact.

## Explicitly out of scope

- Date picker / date range picker
- Rich text editor
- Charts — better served by a dedicated library
- Command palette
- A form validation layer — rowkit provides field states; validation is the
  application's job
- Virtualised lists beyond `DataTable`
- A Figma kit
- A React port

## Non-goals

**Not a general-purpose UI library.** If you need forty components, use
[Nuxt UI](https://ui.nuxt.com) or [shadcn-vue](https://www.shadcn-vue.com).

**Not a CSS framework.** Tailwind v4 is a peer dependency.

**Not opinionated about data fetching.** Components take props.

## Later (not promised)

- A popover — the honest answer to "can a tooltip contain a link"
- Virtualisation for `DataTable`, with a real workload — see
  [decision 004](/decisions/004-datatable-performance)
- A custom docs theme
