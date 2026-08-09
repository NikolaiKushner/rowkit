# Roadmap

The plan of record is
[`ROADMAP.md`](https://github.com/NikolaiKushner/rowkit/blob/main/ROADMAP.md) in
the repository; this page is the readable version. No fixed component count —
new surface ships when it earns a place on a data-dense interface.

## Current surface

| Area        | Components                                                                                                                                                                              |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundations | [Button](/components/button), [ButtonGroup](/components/button-group), [Field & Input](/components/field), [Select](/components/select), [Badge](/components/badge)                     |
| Data        | [DataTable](/components/data-table), [Pagination](/components/pagination), [FilterBar](/components/filter-bar), [EmptyState](/components/empty-state), [Skeleton](/components/skeleton) |
| Overlays    | [Dialog](/components/dialog), [Toast](/components/toast), [Tooltip](/components/tooltip)                                                                                                |

## What 1.0 means

Not a component count — an API that survived contact with applications nobody
wrote in order to use rowkit. Until that has happened, the version stays on
`0.x` and breaking changes remain possible. An API is not proven by its author.

## Design direction

Restraint. Structure without severity. No excess.

Chrome stays neutral, and status colour means something while brand colour does
not live in the defaults. Primary is warm espresso graphite
(`oklch(0.31 0.038 48)`); rebrand by pointing `--color-primary-*` at your own
colour. Soft destructive, soft focus, quiet borders.

## In progress

- Shipping the pending release — a breaking `Button` API, espresso tokens,
  quieter chrome
- Closing a gap in the screenshot-based visual QA, where two overlay stories
  were being captured without the overlay open
- Two consistency calls left over from the restyle: `Badge` `subtle` `primary`
  reads as neutral, and the dark-mode invalid field is louder than the library's
  soft-destructive language elsewhere
- Hardening the pattern pages from real application friction rather than from
  what the components happen to offer

## Next surface (if earned)

- DropdownMenu for table row actions — the most likely next primitive
- Popover, when a tooltip needs a link or richer content
- Sheet / drawer, only if dialogs start feeling wrong for filter or detail panes

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
