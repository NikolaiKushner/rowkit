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

Windows 98. Grey face, two-pixel bevels, navy selection, square corners, a
pixel sans — the style, not the assets. It replaces the earlier restrained look
entirely, and there is one light theme: dark mode is dropped in v2. Status is
carried by an icon as well as a colour. Rebrand by pointing `--color-primary-*`
at your own colour.

## In progress

- The Windows 98 redesign (v2): tokens, every component, the playground and
  this site, drawn in Figma first and then restyled one component at a time
- Closing a gap in the screenshot-based visual QA, where two overlay stories
  were being captured without the overlay open
- Two consistency calls for the redesign to settle: `Badge` `subtle` `primary`
  reads as neutral, and the invalid field is louder than the library's danger
  states elsewhere
- Hardening the pattern pages from real application friction rather than from
  what the components happen to offer

## The professional set (planned, not started)

Menus and overlays (DropdownMenu, Popover, Sheet, confirm dialog) · date and
date-range pickers · command palette · rich text · charts that share these
tokens · `DataTable` virtualisation against a real workload. A component belongs
on this list when a product interface is awkward without it.

## Not the toolkit

A published Figma kit · a React port. Separate work, not components
of this library.

## Non-goals

**Not a CSS framework.** Tailwind v4 is a peer dependency.

**Not opinionated about data fetching.** Components take props.

**Not a validation layer.** rowkit renders field state; deciding what is invalid
is the application's job.
