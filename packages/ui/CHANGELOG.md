# rowkit

## 0.1.0

### Minor Changes

- 7d401a0: Add `Badge` — a non-interactive status label whose colour is the product of `variant` and `appearance`, defaulting to `subtle` because a column of solid badges reads as a wall of colour and stops communicating. An optional `dot` gives the eye a shape to lock onto when the same few statuses repeat down a page, and is `aria-hidden` since it only restates the colour already present.

  _Recorded retroactively — this work predates Changesets being installed._

- 7d401a0: Add `Button` — four variants, three sizes, and a loading state that keeps `aria-busy` rather than `disabled`, so focus survives a request and a screen reader user is not thrown out of the form by their own submit. Clicks are swallowed in the capture phase while loading, and a non-native element takes `aria-disabled` instead, since `disabled` means nothing on an anchor.

  _Recorded retroactively — this work predates Changesets being installed._

- ffc7b1b: Add `DataTable` — column definitions constrained to the row type so a mistyped field is a compile error, per-column cell slots, sticky header, pinned columns with a scroll shadow, single-column sorting, and row selection with a tri-state select-all. Rows carry their own `id` rather than the table taking a `rowKey`, and sorting names a field of the row, so a sort referring to a column that does not exist also fails to compile.
- 25475b8: Add `Dialog`, built on Reka UI's primitive — focus trap, focus restore, scroll lock and background inerting come from there; rowkit supplies the API and the token styling. `title` is a required prop rather than only a slot, so `aria-labelledby` is always wired and replacing `#header` cannot break the accessible name.

  `preventClose` blocks Escape and the scrim for flows where accidental dismissal loses work, but never removes the close button — a dialog with no exit is hostile. Only the body scrolls, so footer actions cannot be pushed off-screen, and the enter/exit animations are gated behind `motion-safe:`.

- ffc7b1b: Add `EmptyState` — a zero-row state with a real heading at a caller-chosen level, so it can be reached by heading navigation and continues the page outline rather than restarting it. `reason` distinguishes the three empties that look alike and mean different things — nothing created, nothing matched, request failed — driving tone and, where the copy is genuinely generic, the description itself.
- 7d401a0: Add `Field` and `Input`. `Field` owns the label, hint, error and required state, generates the control id and wires `aria-describedby` with the hint before the error; `Input` inherits those flags from a surrounding `Field` by OR rather than fallback, so a field can turn them on and a control cannot turn them back off — which also sidesteps Vue casting an absent boolean prop to `false` rather than `undefined`.

  _Recorded retroactively — this work predates Changesets being installed._

- ffc7b1b: Add `FilterBar` — a search landmark holding your filter controls and a removable chip per applied filter, with a live result count so filtering announces its effect to someone who cannot see the table shrink. Focus moves to the chip that took the removed one's place rather than being dropped to the top of the document, so clearing several by keyboard does not cost a round of tabbing each time.
- 8771038: Export a props type for every component — `ButtonProps`, `SelectProps<T>`, `DataTableProps<TRow>` and the rest — so a consumer can annotate a wrapper without restating the surface by hand. Each lives in the component's `types.ts`, since `<script setup>` cannot export a type, and `defineProps` now references it rather than an inline literal.
- 7d401a0: Add `Select` — generic over its value type, with optional search, async options and full keyboard support, built on Reka UI's Combobox with the input as the focusable anchor rather than the trigger, which Reka gives `tabindex="-1"` and labels "Show popup". Includes a workaround for an upstream Reka issue that leaves `aria-activedescendant` pointing at an unmounted list item after the panel closes.

  _Recorded retroactively — this work predates Changesets being installed._

- ffc7b1b: Add `Skeleton` — loading placeholders in three geometries, composable into the shape of the content being waited for. The pulse is `motion-safe:` only so it never renders for anyone who has asked for reduced motion, and every variant carries a default height, since a placeholder that collapses to zero still produces the layout jump it exists to prevent.
- 7d401a0: Add the `cn` class-merge utility and the `rowkit/styles` entry point. `cn` extends `tailwind-merge` with rowkit's own scales read from the token package, so a new token cannot fall out of sync with the merge rules; `rowkit/styles` declares the theme and registers the bundle as a Tailwind source without importing Tailwind itself, which would emit a second preflight over the consumer's.

  _Recorded retroactively — this work predates Changesets being installed._

- ffc7b1b: Add `TablePagination` — a range summary, a rows-per-page select and numbered pages, built on Reka's Pagination primitive with `showEdges` defaulted on so a user on page 12 of 25 can see how far the table runs and reach the end. It never moves the page itself: changing the page size emits `update:pageSize` and nothing else, because only the application knows whether a page change also means a refetch.
- c366abc: Add `Toast` — `useToast()` for calling one from anywhere including outside a component, a module-level queue, and a `<Toaster />` mounted once to render it. Built on Reka UI's Toast, which supplies the countdown, hover-pause, swipe-to-dismiss and an F8 shortcut that moves focus into the notification region; rowkit owns the queue rules on top.

  Five queue rules, each tested: at most `max` visible with the overflow waiting FIFO and no countdown until it appears, hover pausing only the hovered toast, `duration: 0` never auto-dismissing or blocking the queue, and a duplicate message inside 300ms coalescing rather than stacking. Everything announces politely — **danger toasts never become `role="alert"`**, because interrupting a screen reader mid-sentence costs more than hearing the error a moment later.

- e98677c: Add `Tooltip`, built on Reka UI's primitive. It opens on hover **and** on keyboard focus, dismisses with Escape without moving focus, and stays open while the pointer travels onto it — the two halves of WCAG 1.4.13. The trigger is rendered `as-child`, so your element becomes the trigger rather than being wrapped.

  `content` is typed as a `string` with no slot alternative, deliberately: a tooltip never holds focus, so an interactive element inside one is unreachable by keyboard by construction, and the type closes that failure class at the API boundary. Also re-exports Reka's `TooltipProvider` for the shared grace period that lets a pointer sweep a toolbar without re-paying the delay; a lone `Tooltip` supplies its own provider and defers to a real one when present.

- 55a9a03: Add the `useClientSort` composable and remove `DataTable`'s `sortMode` prop. The table no longer sorts its own rows under any setting — it reports the sort and renders what it is handed, so a server-paged table cannot silently reorder just the page on screen and look sorted while being wrong. Local sorting now lives outside the component, where it is testable without mounting.

  Add `row:click`, which puts rows in the tab order and activates them on Enter and Space; a click on a control inside the row does not fire it. Add a `#loading` slot alongside `#empty`.

### Patch Changes

- 5798f9f: Ship `AGENTS.md` inside the package.

  After installing, `node_modules/rowkit/AGENTS.md` describes every component's
  props, `v-model`s, events and slots — including `DataTable`'s per-column
  `#cell:<key>` slot and the full shape of its slot props — plus the setup steps
  that are not visible in a type, such as the `rowkit/styles` import without which
  everything renders unstyled.

  It is generated from the source, so it describes the version installed rather
  than whatever was current when it was written. A coding agent working in your
  project can read it without fetching anything.

- d40baf6: Fix a `sticky` column losing its own header in `DataTable`.

  Every header cell sat on the same `z-sticky` layer, so at equal z-index the
  later cells in the DOM painted over the pinned one. Scrolling right slid the
  neighbouring header straight across the pinned column's heading, while the
  pinned body cells below stayed put — the column kept its data and lost its name.

  The header row now establishes one stacking context and the pinned cell is
  ordered inside it. No API change.

  If your application places rowkit under a **fixed header of its own**, note that
  `--z-index-sticky` is `100`: a table's sticky header will paint over any chrome
  below that. Raise your header above it.

- 4f32275: Fix `Tooltip` rendering nothing when it is inside a `TooltipProvider`.

  A `<Tooltip>` with a provider above it — the arrangement the docs recommend for
  a toolbar, so `skipDelayDuration` lets the pointer sweep across a row of icon
  buttons — rendered no tooltip **and no trigger**. The button simply was not on
  the page, with no error and no warning.

  The internal pass-through wrapper was Vue's `Fragment`, which `<component :is>`
  hands a slots object where it expects an array of vnodes. If you worked around
  this by dropping the provider, you can put it back; a tooltip without one is
  unaffected and always worked.

- 6d7b4e4: Fix the exported `version` constant reporting `0.0.0` on a released build.

  Both packages exported a hand-written literal that a test pinned against
  `package.json`. Changesets bumps the manifest and nothing updated the literal,
  so the first release failed its own test — and had it passed, `version` would
  have reported `0.0.0` from a `0.1.0` package.

  It is now read from `package.json` directly, so the two cannot disagree. Rollup
  tree-shakes the import down to the single string; nothing else from the manifest
  ships.

- Updated dependencies [7d401a0]
- Updated dependencies [6d7b4e4]
  - @rowkit/tokens@0.1.0
