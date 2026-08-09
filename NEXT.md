# What's next

Working backlog for rowkit — polish, proof, process, and new surface when it
earns its place. No fixed component count.

Ideas that stay out until they earn real demand: date pickers, charts, command
palette, form validation layer, Figma kit, React port. Virtualised lists beyond
DataTable only with a real workload (see decision 004).

---

## Design direction (settled)

Restraint. Structure without severity. No excess.

- Chrome stays neutral — near-shadcn. Status colour (success / warning / danger)
  means something; brand colour does not live in the defaults.
- Primary is **warm espresso** `oklch(0.33 0.038 48)` / `#462f24` — premium
  brown-graphite, not pure black and not a loud brand hue. Consumers rebrand by
  pointing `--color-primary-*` at their own colour.
- Soft destructive (wash + coloured label) in light and dark — never a solid
  red brick for the default destructive control.
- Soft silver focus; quiet resting borders (focus carries the cue).
- Typeface stays **Geist**. Weight stays mostly `medium` in chrome.

---

## Just shipped (this arc)

Do not reopen unless real friction shows up:

- Button → shadcn-shaped API (`default` / `outline` / `secondary` / `ghost` /
  `destructive` / `link`) + sizes; soft destructive; typographic `link` focus
- `ButtonGroup`
- Select: trailing check, no heavy selected fill
- Dialog: hairline footer, ghost Cancel, soft Delete, quiet close
- Quiet input borders + soft focus ring tokens
- Money shot density: `Patterns/DataTablePage` + playground `/users`
- Mark / Storybook manager theme aligned to espresso

---

## Now

Ordered. Finish (or deliberately drop) an item before inventing the next.

### 1. Land this branch

Ship the uncommitted arc with honest changesets and a PR — one release story,
not a pile of half-related commits. Consumers should read the changelog and know
what broke (`Button` API) and what got quieter (borders, focus, primary).

### 2. Cross-component consistency pass

Done for this release:

- [x] Focus ring visible and not clipped (Input, Select, Dialog, Pagination);
      Select invalid uses `has-[:focus-visible]`; FilterBar chip remove uses
      solid ring (no `outline-*`)
- [x] Shared control heights in a toolbar (FilterBar Clear maps to Button
      `default`/`sm`; Field `size` inherits to Input/Select; money-shot header
      buttons match FilterBar `md`)
- [x] Disabled / loading / empty / error: DataTable `emptyReason`; filter-empty
      pages use `reason="no-results"`; Select disabled wash via `data-disabled`
- [x] Dark mode: Storybook body paints `bg-background`
- [x] Density on a real table page (`Patterns/DataTablePage`, playground users)

### 3. Docs and agent surface

- [x] `pnpm docs:props` / `pnpm docs:agents` after this release's prop/JSDoc changes
- Docs homepage / pattern page should show the same restraint as the money shot
- "When not to use" stays sharp; cut fluff

### 4. Real-world API pressure

v1.0 is survival in a few real apps, not a component checklist. Prefer:

- Using rowkit in one internal or side project and filing concrete friction
- Hardening docs patterns (`data-table-page`, forms, loading) from that friction
- Locking APIs (`🔒`) only after the above, never before

### Visual QA (standing rule)

After any change that touches variants, tokens, layout, or dark mode:

1. `pnpm visual:check` (or scoped to one component)
2. **Read the PNGs** — light and dark
3. Fix pixels before claiming done

---

## Next surface (only if earned)

Nothing here starts on vibes. Need a concrete place on a data-dense page:

- **DropdownMenu** (or equivalent) — row actions in a table without inventing
  one-off icon menus. Highest-probability next primitive.
- **Popover** — the honest answer to "can a tooltip contain a link"; also the
  shell DropdownMenu sits on if Reka's composition wants it
- Sheet / drawer — only if dialogs start feeling wrong for filter / detail panes

---

## Later (not promised)

- DataTable virtualisation — only with a real workload (decision 004)
- Custom docs theme — legitimate, lowest-information work available

---

## Non-goals (still)

- Not a kitchen-sink UI library (prefer depth on data-dense surfaces)
- Not a CSS framework (Tailwind stays a peer)
- Not opinionated about data fetching
