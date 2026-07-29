# 004 — DataTable is not virtualized in v1

**Status:** accepted
**Decided:** Phase 3. Measured, not estimated.

## Decision

`DataTable` renders every row it is given. No virtualization in v1.

## The numbers

Chromium, built Storybook, 1280×900 viewport. `Data/DataTable/Ten Thousand
Rows` — 10,000 rows × 5 columns, pre-sorted.

|                            | 10,000 rows | 4 rows (baseline) |
| -------------------------- | ----------- | ----------------- |
| Navigate → all rows in DOM | **642 ms**  | 66 ms             |
| DOM nodes                  | **60,139**  | 163               |
| Body cells                 | 50,012      | 32                |
| Scroll frame time, p50     | **8.3 ms**  | 8.3 ms            |
| Scroll frame time, p95     | **9.3 ms**  | 9.4 ms            |

Frame times sampled over 60 programmatic scroll steps inside the table's own
container, discarding the first two frames.

### Reading them

**Scrolling does not care how many rows there are.** p50 and p95 are identical
to the four-row table and comfortably inside a 16.7 ms budget — the browser only
paints what is visible, so a long table costs no more per frame than a short
one. This is the result that makes the decision easy: the thing virtualization
exists to fix is not broken.

**Initial render is the real cost**, and it is ~640 ms — noticeable, on the edge
of acceptable, and it grows linearly. That is the number that says "paginate",
not "virtualize".

**Sorting is measured separately**, in `useClientSort`'s own tests, because the
table never sorts its own rows. The benchmark story is handed pre-sorted data
and says so, so neither cost hides behind the other.

## Why not virtualize

1. **It conflicts with semantic `<table>` markup.** Row heights have to be known
   or measured, sticky headers interact badly with a transformed viewport, and
   screen readers lose the row count they get free from a real table. Every
   virtualized table makes real accessibility trade-offs, and this library's
   whole argument for a `<table>` over a div grid is that the semantics come for
   free.
2. **The realistic dataset is paginated.** This component's audience shows
   25–100 rows at a time against a server that pages. Ten thousand unpaginated
   rows is an anti-pattern; optimising for it at the cost of accessibility is
   optimising for the case the library tells you not to build.
3. **It is additive later.** A `virtual` prop can arrive without breaking the
   API, if a real consumer turns up needing it.

## What v1 does instead

- Renders 10k rows correctly — no crash, scrolling unaffected
- Keeps per-row cost minimal: no per-cell component wrappers, no per-cell
  computed, one `<td>` per cell
- Documents the threshold: **above ~500 rows, paginate** — `TablePagination`
  wiring is in `docs/components/data-table.md`
- Keeps `Data/DataTable/Ten Thousand Rows` as a living benchmark, with its axe
  scan deliberately off (walking 60,000 nodes takes minutes and asserts nothing
  the other stories do not)

## Revisit when

A consumer reports a real workload that genuinely cannot paginate, or the render
cost regresses — re-run the benchmark before assuming which. `v-memo` on rows is
the cheaper first move if selection or sorting starts causing re-render churn;
it is not in yet because nothing has demonstrated the need, and it depends on
the stable row identity `DataTableRow` now guarantees.
