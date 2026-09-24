# Roadmap

The plan of record is
[`ROADMAP.md`](https://github.com/NikolaiKushner/rowkit/blob/main/ROADMAP.md) in
the repository; this page is the readable version. The direction is a
professional toolkit — the components a product interface is built from. No
fixed count. What is listed below as next is the plan, not a build in progress.

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
not live in the defaults. Primary is ink blue
(`oklch(0.32 0.09 255)`); rebrand by pointing `--color-primary-*` at your own
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

## The professional set (planned, not started)

Menus and overlays (DropdownMenu, Popover, Sheet, confirm dialog) · date and
date-range pickers · command palette · rich text · charts that share these
tokens · `DataTable` virtualisation against a real workload. A component belongs
on this list when a product interface is awkward without it.

## Not the toolkit

A custom docs theme · a Figma kit · a React port. Separate work, not components
of this library.

## Non-goals

**Not a CSS framework.** Tailwind v4 is a peer dependency.

**Not opinionated about data fetching.** Components take props.

**Not a validation layer.** rowkit renders field state; deciding what is invalid
is the application's job.
