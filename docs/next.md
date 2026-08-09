# What's next

The backlog lives in
[`NEXT.md`](https://github.com/NikolaiKushner/rowkit/blob/main/NEXT.md) in the
repository; this page is the readable version. No fixed component count —
new surface ships when it earns a place on a data-dense interface.

## Current surface

| Area        | Components                                                                                                                                                                              |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundations | [Button](/components/button), [ButtonGroup](/components/button-group), [Field & Input](/components/field), [Select](/components/select), [Badge](/components/badge)                     |
| Data        | [DataTable](/components/data-table), [Pagination](/components/pagination), [FilterBar](/components/filter-bar), [EmptyState](/components/empty-state), [Skeleton](/components/skeleton) |
| Overlays    | [Dialog](/components/dialog), [Toast](/components/toast), [Tooltip](/components/tooltip)                                                                                                |

What remains before v1.0 is time and real-world use: an API is not proven by
its author.

## Design direction

Restraint. Structure without severity. No excess.

Chrome stays neutral. Primary is warm espresso graphite
(`oklch(0.33 0.038 48)`). Soft destructive, soft focus, quiet borders. See
[`NEXT.md`](https://github.com/NikolaiKushner/rowkit/blob/main/NEXT.md).

## Working backlog

### Land the current arc

Ship Button API / ButtonGroup / espresso tokens / quiet chrome / docs home with
honest changesets. Then stop reopening that cluster unless real friction appears.

### Consistency pass

Done for this release: focus recipes (Select invalid, FilterBar chip remove),
toolbar heights (FilterBar Clear, Field→control size inheritance), and
`DataTable` `emptyReason` for intentional empty/filter-empty states.

### Real-world API pressure

Prefer friction from actual apps over inventing features. Lock APIs only after
that contact.

### Visual QA for agents

After any change that touches variants, tokens, layout, or dark mode, agents run
`pnpm visual:check`, open the PNGs, and fix what looks wrong.

## Next surface (if earned)

- DropdownMenu for table row actions
- Popover when a tooltip needs a link / richer content
- Sheet / drawer only if dialogs feel wrong for filter or detail panes

## Explicitly out of scope (until demand)

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

**Not a kitchen-sink UI library.** Prefer depth on data-dense surfaces over
breadth for its own sake.

**Not a CSS framework.** Tailwind v4 is a peer dependency.

**Not opinionated about data fetching.** Components take props.

## Later (not promised)

- Virtualisation for `DataTable`, with a real workload — see
  [decision 004](/decisions/004-datatable-performance)
- A custom docs theme
