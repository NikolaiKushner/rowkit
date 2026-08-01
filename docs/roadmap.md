# Roadmap

Twelve components for v1.0. That number is a decision rather than a stage on the
way to forty, and this page is the honest version of what exists, what does not,
and what was deliberately left out.

[`ROADMAP.md`](https://github.com/NikolaiKushner/rowkit/blob/main/ROADMAP.md) in
the repository is the source of truth; this page is the readable one.

## Stages

| Stage           | Meaning                                                                 |
| --------------- | ----------------------------------------------------------------------- |
| 🟡 Experimental | Renders, has a story, the API may still change                          |
| 🟢 Stable       | Full API documented, tested, a11y verified, keyboard support, dark mode |
| 🔒 Locked       | Stable, and no breaking change without a major version                  |

Nothing is Locked before v1.0, because that is what v1.0 means.

## v1.0 scope

**Foundations**

| Component                          | Stage     |
| ---------------------------------- | --------- |
| [Button](/components/button)       | 🟢 Stable |
| [Field & Input](/components/field) | 🟢 Stable |
| [Select](/components/select)       | 🟢 Stable |
| [Badge](/components/badge)         | 🟢 Stable |

**Data**

| Component                                       | Stage     |
| ----------------------------------------------- | --------- |
| [DataTable](/components/data-table)             | 🟢 Stable |
| [TablePagination](/components/table-pagination) | 🟢 Stable |
| [FilterBar](/components/filter-bar)             | 🟢 Stable |
| [EmptyState](/components/empty-state)           | 🟢 Stable |
| [Skeleton](/components/skeleton)                | 🟢 Stable |

**Overlays**

| Component                      | Stage     |
| ------------------------------ | --------- |
| [Dialog](/components/dialog)   | 🟢 Stable |
| [Toast](/components/toast)     | 🟢 Stable |
| [Tooltip](/components/tooltip) | 🟢 Stable |

All twelve meet the definition of done. What remains before v1.0 is time and
real-world use: an API is not proven by its author.

## Where the project is

The library is built, tested and documented. It is **not on npm yet** — the name
is reserved and publishing is the final phase of the plan. Until then the source
is on [GitHub](https://github.com/NikolaiKushner/rowkit) and this site runs the
real components.

After the first release, the useful work is feedback from people who are not me.
Version 1.0 comes when the API has survived contact with a few real
applications, not when a checklist empties.

## Considered, not planned

Reasonable ideas that are explicitly out of scope for v1.0. Recording them is how
they stay out:

- Date picker / date range picker
- Rich text editor
- Charts — better served by a dedicated library
- Command palette
- A form validation layer — rowkit provides field states; validation is the
  application's job, and [the forms pattern](/patterns/forms) shows the wiring
- Virtualised lists beyond `DataTable`
- A Figma kit
- A React port

If one of these is what you need, a broader kit or a specialist library is the
better answer, and rowkit composes with both.

## Non-goals

**Not a general-purpose UI library.** If you need forty components covering every
case, use [Nuxt UI](https://ui.nuxt.com) or
[shadcn-vue](https://www.shadcn-vue.com). Both are good; see
[the introduction](/introduction) for how to route yourself between them.

**Not a CSS framework.** Tailwind v4 is a peer dependency. rowkit does not
replace it, wrap it, or ship its own copy.

**Not opinionated about data fetching.** Components take props. Where the data
comes from, and when, is yours.

## Beyond v1.0

Nothing here is promised, and none of it starts before the API has settled:

- A popover, which is the honest answer to "can a tooltip contain a link"
- Virtualisation for `DataTable`, once there is a real workload that needs it
  rather than a benchmark — see
  [the decision record](/decisions/004-datatable-performance) for the current
  reasoning
- A custom docs theme, which is a legitimate project and the lowest-information
  work available today

## Suggesting something

Open an issue. The most useful ones describe the problem rather than the
component — "the filter bar cannot show a range" is far more actionable than
"add a date picker", and often has an answer that needs no new component at all.
