# rowkit Restyle — Adopting the shadcn/ui Design Language

**Goal:** rowkit components become visually indistinguishable from shadcn/ui defaults — colors, radii, shadows, sizing, typography, focus treatment, dark mode.
**Version impact:** visual breaking change → ships as **0.2.0**. Not "a single minor changeset": Part 3 splits the work across six PRs and hard rule 6 requires one per public API change, so expect six, all `minor`, collapsing into one `0.2.0` release when the last merges. The summary sentence below belongs in the R1 changeset; the rest describe their own slice.
**Source of truth:** ui.shadcn.com/docs/theming (token values verified against the live docs) + shadcn-vue component source for per-component classes.
**License note:** shadcn/ui is MIT. Copying token values and class recipes is permitted. Add one line to the rowkit README and docs: _"Design language based on shadcn/ui by shadcn, adapted for Vue."_ Attribution isn't legally required by MIT for design values, but it's honest and reads well.

---

## Part 0 — The architectural decision (read before touching code)

shadcn's theme model and rowkit's current token model are **structurally different**, and the agent must not blend them naively:

- **rowkit today:** 11-step primitive ramps (`neutral-50…950`, etc.) + a semantic layer referencing them.
- **shadcn:** a **flat, purely semantic** model. No exposed primitive ramps. Every token is a surface/foreground _pair_: `primary` + `primary-foreground`, `card` + `card-foreground`. The base token is the surface; `-foreground` is what sits on it.

**Decision: adopt shadcn's semantic model as rowkit's public token API.**

- The primitive ramps may remain as internal implementation detail in `@rowkit/tokens` (they're useful for future theme presets), but **components reference only semantic tokens**, and the semantic set becomes shadcn's set.
- This changes `@rowkit/tokens`' public surface → it's the reason this is 0.2.0, not 0.1.x.
- Existing rowkit semantic names map as follows:

| rowkit 0.1 token         | rowkit 0.2 token           | note                                                     |
| ------------------------ | -------------------------- | -------------------------------------------------------- |
| `--color-background`     | `--color-background`       | unchanged — already shadcn's name                        |
| `--color-surface`        | `--color-card`             | rowkit's `surface` is the raised plane, not the page     |
| `--color-surface-subtle` | `--color-muted`            | table headers, toolbars                                  |
| `--color-surface-hover`  | `--color-accent`           | shadcn has no hover token; `accent` is what its rows use |
| `--color-text`           | `--color-foreground`       |                                                          |
| `--color-text-muted`     | `--color-muted-foreground` |                                                          |
| `--color-border-control` | `--color-input`            | the form-control boundary — **not** `border-strong`      |
| `--color-focus-ring`     | `--color-ring`             |                                                          |
| `--color-border`         | `--color-border`           | unchanged                                                |

**Renamed, and no further.** The tokens above map one-to-one onto shadcn's, so anyone who has themed shadcn already knows how to theme rowkit — which was the whole strategic point of Part 0.

The rest keep rowkit's names on purpose:

- `surface-active`, `surface-selected`, `surface-disabled`, `skeleton`, `text-subtle`, `text-disabled`, `border-strong`, `border-subtle` have **no shadcn equivalent**. Collapsing them into `--muted-foreground` as this document once proposed would delete real states — a pressed row and a selected row would become the same token, and a disabled label the same as a placeholder.
- The status families (`primary-solid`, `danger-subtle`, `warning-on-solid`, …) stay. shadcn's flat `--primary` / `--destructive` carries no `solid`/`subtle`/`outline` axis, and Badge and Button expose exactly that axis as a prop. Renaming them would mean redesigning those APIs, which Part 0 forbids two lines further down.

**Component prop APIs do not change.** `variant="danger"` stays `danger`. This is a restyle, not an API break.

### 0.1 The constraint that decides how the values are entered

`color.test.ts` asserts that **every semantic token matches `^var\(--color-[a-z0-9-]+\)$`** and points at a primitive that exists — hard rule 1, enforced. A second test forbids a semantic token referencing another semantic token, and `contrast.test.ts` resolves tokens through the same `var()` form, so a literal there throws rather than fails.

shadcn's model is flat literals in the semantic layer. Pasting §1.1 into `semanticColorLight` therefore breaks the token suite on the first run, before any component is touched.

**So the values enter as primitives.** Add shadcn's greys as a primitive scale (they do not coincide with rowkit's `neutral-*` ramp — shadcn's are zero-chroma, rowkit's are hue 264), then point the new semantic set at them by reference. The public semantic API becomes shadcn's; the mechanism stays rowkit's. Nothing about the architecture needs relaxing, but the naive paste does not work and the agent must not "fix" the tests to make it.

`--border: oklch(1 0 0 / 10%)` in dark mode is white at alpha, not a ramp step — it needs a primitive of its own (`white-alpha-10`, `white-alpha-15`), since the regex admits no `/` in a token name.

---

## Part 1 — The exact token values (verified against shadcn docs)

### 1.1 Light theme (`:root`)

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}
```

### 1.2 Dark theme (`.dark`)

```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}
```

**Details that make dark mode _feel_ like shadcn — do not "fix" these:**

- Dark borders are **white at 10% alpha**, not a solid grey. Inputs at 15%. This is why shadcn dark borders look soft on any surface.
- Dark `primary` **inverts**: near-white surface, near-black text. A rowkit primary button in dark mode is light, not colored.
- Everything is **zero chroma** (pure neutral) except `destructive`. The shadcn look _is_ this restraint.

### 1.3 Success / warning (rowkit additions, shadcn recipe)

shadcn's default set has no success/warning; rowkit's Badge and Toast need them.

> **The values previously listed here were unusable and have been replaced.** Measured with rowkit's own contrast maths: `--success-foreground` on `--success` came to **2.19:1** in light mode against a 4.5 requirement — a label you cannot read. The warning fill sat at **1.65:1** against the page (light) and **2.14:1** (dark), failing WCAG 1.4.11 for a control the user has to locate. "Eyeball it in Storybook" is not how this repo has ever set a colour; every pairing is asserted.

Solved against the same gates instead — lightest step that clears both a 4.5:1 label and a 3:1 fill against the page, at rowkit's existing hues and chroma so the families stay perceptually matched:

```css
:root {
  --success: oklch(0.65 0.142 152);
  --success-foreground: oklch(0.205 0 0); /* dark label — white gives 3.04:1 */
  --warning: oklch(0.67 0.128 75);
  --warning-foreground: oklch(0.205 0 0);
}
```

Light mode: success fill 3.04:1 vs page with a 5.89:1 label; warning 3.05:1 with 5.87:1. Both carry a **dark** label, not white — the same conclusion rowkit reached in 0.1 for amber, and it holds for green too at any lightness that keeps the fill visible on a white page.

Dark mode values are still to be solved when R1 runs; do it the same way rather than mirroring, and add every new pair to `contrast.test.ts` in the same commit.

### 1.4 Radius scale — a formula, not a list

**Status: implemented.** Shipped ahead of the rest of R1, since token names do not change and no component needed editing.

`--radius: 0.625rem` (10px) is the single source; everything derives:

```css
--radius-xs: calc(var(--radius) * 0.4); /* rowkit's — lands on 4px */
--radius-sm: calc(var(--radius) * 0.6);
--radius-md: calc(var(--radius) * 0.8);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) * 1.4);
```

Multiplication, not `calc(var(--radius) - 4px)` subtraction — confirmed against both ui.shadcn.com and shadcn-vue. The two forms happen to agree at the default 10px and diverge only once `--radius` is overridden, which is exactly when it matters.

`xs` is rowkit's addition: components use `rounded-xs` nine times, shadcn's list has no `xs`, and left undefined it falls back to Tailwind's own 2px. At 0.4 it lands on 4px — the radius shadcn hardcodes on its Checkbox. `none` and `full` stay as they were.

> **`--radius` must be declared outside `@theme`.** Tailwind emits only the theme variables its generated utilities reference, and a bare `--radius` generates no utility. Left inside `@theme` it can be dropped from the output while every `rounded-*` rule still looks correct — and `calc()` over an undefined variable is not a CSS error, so `border-radius` computes to nothing and every corner in the library goes square with no warning anywhere. It is declared in its own `:root` block, and `theme.test.ts` asserts on the compiled stylesheet that it survived.

One variable retunes every corner in the library — keep that property; it's better engineering than a flat list.

### 1.5 The Tailwind bridge (`@theme inline`)

The `:root`/`.dark` variables are raw values; expose them to Tailwind utilities via `@theme inline` in the tokens CSS, mapping `--color-background: var(--background)` etc. for every pair, plus the radius scale. This replaces rowkit's current `@theme` block contents. The `@source` distribution architecture from Phase 1 is unaffected — only the values and names inside change.

---

## Part 2 — Component-level restyle specs

**Method for the agent:** for every component below, the authoritative class recipes live in **shadcn-vue's source** (`ui.shadcn.com` renders React; shadcn-vue is the Vue port of the same design and is the better crib for Vue templates). Step one of each component's session: pull up the corresponding shadcn-vue component source and extract its classes into the `.variants.ts` file. The reference values below are the current well-known recipes — **verify each against live source at implementation time; where they differ, source wins.**

### Shared treatments (apply first, everywhere)

- **Typography:** component text is `text-sm` (14px). No component uses base-16 text.
- **Focus ring:** `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]` — a 3px ring at 50% opacity **plus** the border shifting to ring color. This exact recipe on every focusable element; it's the single most recognizable shadcn detail.
- **Invalid state:** `aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive`.
- **Shadows are near-absent:** `shadow-xs` on buttons/inputs/cards, `shadow-md` on popover-scale overlays, `shadow-lg` on Dialog. Nothing heavier. If a rowkit component currently has a stronger shadow, remove it.
- **Transitions:** `transition-[color,box-shadow]` on interactive elements — shadcn does not transition all properties.
- **Disabled:** `disabled:pointer-events-none disabled:opacity-50`.

### Button

- Sizes: `sm` = `h-8 px-3`, `md` (default) = `h-9 px-4 py-2`, `lg` = `h-10 px-6`; all `text-sm font-medium`, gap-2, `rounded-md`, `shadow-xs` (not on ghost).
- Variants → shadcn mapping: `primary` → `bg-primary text-primary-foreground hover:bg-primary/90`; `secondary` → `bg-secondary text-secondary-foreground hover:bg-secondary/80`; `ghost` → `hover:bg-accent hover:text-accent-foreground`; `danger` → destructive recipe (`bg-destructive text-white hover:bg-destructive/90`, dark: `dark:bg-destructive/60`).
- Icon slots: SVGs auto-sized `size-4`, `shrink-0`.
- Keep rowkit's `loading` / `aria-busy` behavior — style the spinner `size-4 animate-spin`, keep layout reservation.

### Field / Input

- Input: `h-9 px-3 py-1 text-sm rounded-md border bg-transparent shadow-xs`, border color from `--input`, dark: `dark:bg-input/30`. Placeholder `placeholder:text-muted-foreground`. Focus + invalid per shared treatments.
- Field label: `text-sm font-medium`; hint and error `text-sm`, hint in `text-muted-foreground`, error in `text-destructive`. Keep all existing wiring (ids, describedby, role=alert) untouched — this phase changes classes only.

### Select

- Trigger styled as Input (h-9 recipe + chevron `size-4 opacity-50`).
- Popup: `bg-popover text-popover-foreground rounded-md border shadow-md`, items `text-sm rounded-sm px-2 py-1.5`, highlighted item `bg-accent text-accent-foreground`, check indicator `size-4`.

### Badge

- `rounded-md border px-2 py-0.5 text-xs font-medium w-fit gap-1`.
- `neutral` → secondary recipe; `success`/`warning` → the new token pairs; `danger` → destructive. Note shadcn badges are **borderless when filled** (`border-transparent`) — replicate.

### DataTable / Table

- shadcn's Table, from `registry/new-york-v4/ui/table.tsx` verbatim:

  ```
  row:   border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted
  head:  h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground
  cell:  p-2 align-middle whitespace-nowrap
  table: w-full caption-bottom text-sm     header: [&_tr]:border-b
  ```

- **Correction: header cells are `text-foreground`, not `text-muted-foreground`** as this document previously said, and they carry **no background fill** — shadcn's header is transparent with a hairline under it, not a recessed grey band. Both were wrong here and both are visible in any screenshot of the component.
- rowkit's header must still be opaque, because it can be sticky; it takes `bg-card` (the table's own plane) rather than transparency, which is the smallest change that keeps sticky working.
- Padding tightens: `px-2` on heads and `p-2` on cells, against rowkit's `px-3`. shadcn's table is denser than rowkit's was.
- Sticky header background: `bg-background` (opaque — the existing scroll-shadow affordance stays, restyled subtle).
- Selection checkboxes: shadcn Checkbox recipe (`size-4 rounded-[4px] border shadow-xs`, checked `bg-primary text-primary-foreground border-primary`).
- Sort buttons inside `th`: ghost-button treatment, `text-muted-foreground`, arrow icon `size-4`.
- Loading skeleton rows and EmptyState composition unchanged structurally — restyle only.

### TablePagination

- Buttons: ghost/outline button `size-9` (icon buttons) recipe; range text `text-sm text-muted-foreground`; page-size Select inherits Select restyle.

### EmptyState

- Container: no border by default (shadcn "Empty" pattern is open space): icon slot `text-muted-foreground`, title `text-lg font-medium`, description `text-sm text-muted-foreground`, action gets Button as-is.

### Skeleton

- shadcn's Skeleton is exactly: `bg-accent rounded-md animate-pulse`. Replace rowkit's shimmer/opacity animation with `animate-pulse` — **keep** the `prefers-reduced-motion` story and the `static` prop (pulse honors reduced motion via the existing media-query guard).

### Dialog

- Panel: `bg-background rounded-lg border p-6 shadow-lg sm:max-w-lg gap-4`, title `text-lg font-semibold`, description `text-sm text-muted-foreground`. Close button top-right: ghost, `size-4` icon, `opacity-70 hover:opacity-100`.
- Enter/leave: fade + slight zoom (`zoom-in-95` feel) — map to rowkit motion tokens; durations stay token-driven.

**Overlay — the scrim is blurred.** Two recipes exist upstream and they are not the same:

| shadcn source                                       | overlay                                                 |
| --------------------------------------------------- | ------------------------------------------------------- |
| `registry/new-york-v4/ui/dialog.tsx` (the default)  | `bg-black/50`, **no blur**                              |
| `registry/styles/style-*.css` (maia, lyra, vega, …) | `bg-black/80 supports-backdrop-filter:backdrop-blur-xs` |

rowkit takes the blurred one, at the default's 50% scrim rather than 80%: blur plus 80% black is nearly opaque, and the point of blurring is that the page behind stays legible as context.

- The blur **must** be behind `supports-[backdrop-filter]:`. `backdrop-filter` is unsupported or disabled in enough places (older WebKit, some Linux/GPU configurations, forced-colors mode) that an unguarded blur silently degrades to a plain scrim on some machines and not others. The guard makes that a declared fallback instead of an accident.
- The blur radius is a token. There is no blur scale in `@rowkit/tokens` yet — add one; hard rule 1 has no exception for filters.
- `bg-black/50` is not literal black in rowkit: the scrim already references the shadow primitive. Keep it a token reference.

### Dialog — keyboard, in full

Reka UI supplies this behaviour; the work is asserting it, because a focus trap that quietly stops trapping is invisible until someone tabs into the page behind an open modal and starts operating it.

Every one of these gets an interaction test:

- **Tab cycles inside the dialog and never leaves it.** From the last focusable element, Tab returns to the first.
- **Shift+Tab cycles backwards**, and from the first element wraps to the last.
- **Focus enters the dialog on open** — asserted today by `Accessibility`.
- **Focus returns to the trigger on close** — asserted today by `EscapeRestoresFocus`.
- **Escape closes**, unless `preventClose`, in which case the close button still works and the dialog is not a trap — asserted today by `PreventCloseIsNotATrap`.
- **Background content is inert**: elements behind the scrim are not reachable by Tab.

The first, second and last of these are missing and are the reason this section exists.

### Toast

- Card: `bg-popover text-popover-foreground rounded-lg border p-4 shadow-lg text-sm`, variant left-accent or icon per current design but colored via the semantic pairs (`destructive`, `success`, `warning`). Action button = small outline Button. Queue behavior untouched.

### Tooltip

- `bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-xs`, subtle fade/zoom in. (Yes — shadcn tooltips are primary-colored, i.e. near-black in light mode, near-white in dark. Keep it; it's part of the look.)

### FilterBar

- No shadcn equivalent — style by composition: chips = Badge `secondary` recipe with a ghost close button (`size-3.5` icon), clear-all = ghost Button `sm`. Container spacing `gap-2`.

---

## Part 3 — Execution plan for the agent

Work on branch `feat/shadcn-restyle`. One PR per group, standard DoD applies minus docs-prose rewrites (visual specs in stories are the artifact).

| Session | Scope                                                                                                                                                                                     | Gate                                                                                                                                                           |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1      | `@rowkit/tokens`: new semantic set, foreground pairs, success/warning additions, `@theme inline` bridge, dark mode. Migrate primitives to internal. (Radius formula: **done**, see §1.4.) | Tokens docs page renders the new set; dark toggle correct; **zero hardcoded values anywhere** (existing hard rule); every new pair added to `contrast.test.ts` |
| R2      | Shared treatments + Button, Badge, Skeleton                                                                                                                                               | Storybook side-by-side vs ui.shadcn.com matches                                                                                                                |
| R3      | Field/Input, Select                                                                                                                                                                       | Same + a11y suite still green (focus recipe changed — re-verify visible focus in both modes)                                                                   |
| R4      | Table family: DataTable, TablePagination, EmptyState, FilterBar                                                                                                                           | Users-admin playground page reads as a shadcn dashboard                                                                                                        |
| R5      | Overlays: Dialog, Toast, Tooltip                                                                                                                                                          | Stacking scene re-verified; reduced-motion stories pass                                                                                                        |
| R6      | Sweep: docs site theme vars remapped to new tokens; new screenshots; changeset; bundle budget check                                                                                       | Storybook reviewed by eye in both themes; no visual-regression service — see below                                                                             |

**Visual regression: decided against.** Chromatic was wired up and then removed. It is a paid third-party service with an ongoing cost, and its first act on this repository would have been to demand a diff review across every story at once — the restyle rewrote nearly all of them, so the first build carries no signal and the value only begins afterwards.

The gate is struck rather than left aspirational, because a checklist item nobody can run is worse than an absent one: it reads as covered.

**What this costs, stated plainly.** Nothing checks that a visual change was intended. The suite still catches a great deal — `theme.test.ts` proves every utility resolves to a token, `variants.test.ts` proves every class compiles, `contrast.test.ts` proves every colour pairing meets AA, and the axe scan proves each story renders without a violation in both themes. None of that notices a button that is forty pixels too wide.

**If it comes back**, three things have to be true or it is worse than nothing:

- `fetch-depth: 0` on checkout. Chromatic finds its baseline by walking git history; under the default shallow clone there is no ancestor, so every commit becomes a new baseline and **every visual change passes silently**.
- `exitZeroOnChanges: true`. A visual diff is a review decision, not a test failure.
- **TurboSnap off.** It picks which stories to re-shoot from the Vite module graph, and a design-token change is precisely the case where "this story's files did not change" is both true and completely wrong.

The cheap substitute, if one is wanted later: the a11y suite already drives Playwright, so a screenshot pass over the story list is a local afternoon rather than a subscription.

**Verification protocol (the "double-check" requested):**

1. Per component: open ui.shadcn.com's component demo and rowkit's story side by side, light and dark, at 100% zoom. Compare: height, padding, radius, border color, text size/weight, focus ring, hover state, shadow.
2. DevTools-measure any doubt — computed `height` on a default button must be **36px** (h-9), radius **calc(0.625rem * 0.8)** = 8px for `rounded-md`.
3. The a11y gates re-run in full. **Correction: shadcn's own pairs do not all pass AA** — this was asserted here without being measured, and it is wrong. Run against rowkit's contrast maths, shadcn's default set fails in four places before any rowkit addition:

   | Pair                          | shadcn | required |
   | ----------------------------- | ------ | -------- |
   | focus ring vs page (light)    | 2.59:1 | 3:1      |
   | input border vs page (light)  | 1.26:1 | 3:1      |
   | muted text on `muted` (light) | 4.34:1 | 4.5:1    |
   | white on `destructive` (dark) | 2.89:1 | 4.5:1    |

   shadcn's own dark-mode recipe `dark:bg-destructive/60` lifts the last to 4.36:1 — still short. Dark mode is otherwise clean; every failure above is light mode.

   **Resolution chosen: match shadcn, fix only what fails.** Minimal solved deviations: `--ring` 0.708 → **0.669**, `--muted-foreground` 0.556 → **0.547**, `--input` 0.922 → **0.669**. `--border` stays at shadcn's 0.922 — rowkit's model already distinguishes a decorative hairline from a control boundary, and WCAG 1.4.11 governs only the latter, so tables and cards remain pixel-exact while input borders darken.

4. Bundle budget: class churn shouldn't move it meaningfully; confirm.

**Out of scope, explicitly:** sidebar tokens, chart tokens (rowkit has no such components); any component API change; any behavior change. If a session finds itself editing anything but classes, variants files, and token files — stop, that's scope drift.

---

## Part 4 — What to tell the world (post-restyle)

- Changeset text: "Visual refresh: rowkit now ships the shadcn/ui neutral design language out of the box. No API changes. Custom themes via the same token overrides as before."
- Docs: the theming page gains "rowkit follows the shadcn token convention — if you've themed shadcn/ui, you already know how to theme rowkit." That sentence is the strategic payoff of this whole effort: **instant familiarity for the largest design-token-literate audience in frontend.**
- One more LinkedIn post lives here: "why my Vue library adopted shadcn's design language (and what its token system taught me)."
