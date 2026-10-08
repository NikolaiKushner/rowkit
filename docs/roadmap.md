# Roadmap

The plan of record is
[`ROADMAP.md`](https://github.com/NikolaiKushner/rowkit/blob/main/ROADMAP.md) in
the repository; this page is the readable version. The direction is a
professional toolkit — the components a product interface is built from. No
fixed count. What is listed below as next is the plan, not a build in progress.

## Current surface

| Area        | Components                                                                                                                                                                                                                                                            |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundations | [Button](/components/button), [ButtonGroup](/components/button-group), [Field & Input](/components/field), [Select](/components/select), [Checkbox](/components/checkbox), [Radio](/components/radio), [Badge](/components/badge), [Separator](/components/separator) |
| Data        | [DataTable](/components/data-table), [Pagination](/components/pagination), [FilterBar](/components/filter-bar), [EmptyState](/components/empty-state), [Skeleton](/components/skeleton), [ProgressBar](/components/progress-bar)                                      |
| Overlays    | [Dialog](/components/dialog), [Toast](/components/toast), [Tooltip](/components/tooltip)                                                                                                                                                                              |
| Layout      | [Window](/components/window), [GroupBox](/components/group-box), [StatusBar](/components/status-bar), [ScrollArea](/components/scroll-area)                                                                                                                           |

## What 1.0 means

Not a component count — an API that survived contact with applications nobody
wrote in order to use rowkit. Until that has happened, the version stays in
the 1.0 beta and breaking changes remain possible. An API is not proven by its author.

## Design direction

Two themes from one set of components, both drawn in Figma first. **Windows
98**, the default: grey face, two-pixel bevels, navy selection, square corners,
PT Sans — the style, not the assets — in one light scheme. **Modern**: the look
of a current desktop operating system, light and dark. Status is carried by an
icon as well as a colour. A theme is token values only: change a few, or make a
theme of your own — see [Themes](/foundations/themes).

## Next

- Deciding which theme is the default: the plan is modern, with Windows 98 one
  attribute away
- Theming through a coding agent: instructions that ship with the package,
  and a command that checks a theme's tokens and contrast
- Closing a gap in the screenshot-based visual QA: two overlay stories are
  captured without the overlay open, and the screenshots cover Windows 98 only
- Hardening the pattern pages from real application friction rather than from
  what the components happen to offer

## The professional set (planned, not started)

Switch, Tabs and Combobox, the designer's next wave · menus and overlays (DropdownMenu, Popover, Sheet, confirm dialog) · date and
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
