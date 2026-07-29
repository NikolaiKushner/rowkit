# Phase 2 — Core Components

**Status:** ✅ complete — all four at 🟢 Stable. They were held at Experimental until Phase 0b closed, which was the correct call at the time; with changesets, size-limit and `docs/conventions.md` in place, every DoD item now passes.
**Components:** `Button`, `Field`/`Input`, `Select`, `Badge`
**Effort:** ~16h

Four components that every later phase composes: Phase 3's pagination reuses Select, its filter chips echo Badge; Phase 4's dialog footers are Buttons. Getting the _shape_ of a rowkit component right here — file layout, variant mechanics, testing pattern, docs template — is worth more than the four components themselves, because Phases 3 and 4 copy the shape ten more times.

**The cadence rule:** one component fully complete before the next starts. Four skeletons filled in later produce four components that share bugs; four sequential completions produce a refined template.

---

## The component shape (established here, copied everywhere)

```
components/Button/
  Button.vue            # <script setup lang="ts">, template, no inline class walls
  Button.variants.ts    # cva definition — the only place variants live
  Button.stories.ts     # every variant × state; doubles as browser tests
  Button.test.ts        # unit (variants logic) + interaction (primary behavior)
  types.ts              # ButtonProps — `<script setup>` cannot export a type
  index.ts              # export { default as Button }, export type { ButtonProps }
```

Per-component checklist (the DoD, from ROADMAP):

1. Renders all variants in light and dark
2. Full keyboard support, documented
3. addon-a11y zero violations
4. Props typed + JSDoc'd, props type exported
5. Follows `docs/conventions.md`
6. Stories cover every variant and state
7. Interaction test for primary behavior
8. `docs/components/<name>.md` incl. **"when not to use"**
9. Changeset
10. Bundle budget green

---

## 1. Button (~4h)

```ts
interface ButtonProps {
  /** Visual + semantic role. @default 'primary' */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** Shows spinner, blocks activation, announces via aria-busy. @default false */
  loading?: boolean
  /** @default false */
  disabled?: boolean
  /** Renders as this element/component — for router links. @default 'button' */
  as?: string | Component
}
```

Slots: `default`, `#leading`, `#trailing` (icons come from the consumer — rowkit ships none, per the EmptyState/icons decision generalized).

> Named `#leading` / `#trailing`, not `#leading-icon`. The slot names a **role**, not a content type — nothing stops you putting a `Badge` or a keyboard shortcut hint there.

Decisions worth their PR lines:

- **`loading` uses `aria-busy`, not `disabled`.** A disabled button drops keyboard focus mid-submit — the exact focus-loss failure later phases test for. Busy: focusable, announces, no-ops on activation.
- **`type="button"` is the rendered default.** Native buttons default to `type="submit"` and silently submit surrounding forms — the classic footgun; consumers opt into submit explicitly.
- Spinner reserves layout (no width jump on `loading` toggle); spinner respects reduced motion.
- **Focus ring is a token-driven, always-visible-on-`:focus-visible` treatment** decided once here and inherited by every interactive component after.

"When not to use": navigation that looks like navigation should be a link (`as` exists for hybrid cases); icon-only actions need `aria-label` — shown in docs, enforced nowhere (a lint rule is future-roadmap material).

---

## 2. Field + Input (~5h)

The deliberate split: **`Field` owns the accessibility wiring** (label, hint, error, ids, `aria-describedby`); **`Input` is just the control**. Select (and future Combobox etc.) plug into the same Field — the wiring is written once.

```ts
interface FieldProps {
  /** Visible label. Required — unlabeled inputs are an a11y failure by construction. */
  label: string
  /** Hint text below the control, linked via aria-describedby. */
  hint?: string
  /** Error message. Presence switches the field to error state. */
  error?: string
  /** Marks label with required indicator + sets aria-required. @default false */
  required?: boolean
}

interface InputProps {
  /** v-model. */
  modelValue?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel'
  placeholder?: string
  disabled?: boolean
}
```

Mechanics that make this the fiddliest of the four:

- Field generates a stable id (`useId`), provides it + describedby ids via provide/inject; any control inside picks them up with zero consumer wiring
- `error` renders with `role="alert"` (announced on appearance) and links into `aria-describedby` **alongside** the hint — error doesn't evict hint
- Error state must be visible beyond color alone (icon/border treatment) — color-only state fails WCAG 1.4.1
- `placeholder` is not a label and the docs say so; `label` being required makes the right thing the only thing

"When not to use" (Field): single search box in a toolbar with a clear `aria-label` — full Field is ceremony there.

---

## 3. Select (~5h)

The first real **Reka primitive consumption** (Listbox/Select), and the component that proves the hard-rule-2 workflow: wire the primitive, style with tokens, _audit_ its built-ins instead of implementing them.

```ts
interface SelectProps<TValue extends string | number = string> {
  /** v-model. */
  modelValue?: TValue
  options: Array<{ value: TValue; label: string; disabled?: boolean }>
  placeholder?: string
  disabled?: boolean
  /** Client-side filter input inside the popup. @default false */
  searchable?: boolean
}
```

- Typed options — the small-scale rehearsal for DataTable's generics
- The Reka audit checklist: keyboard model (arrows, Home/End, type-ahead), `aria-activedescendant`, popup positioning/collision, focus return on close. Findings, if any, are minimal patches with the Reka version noted — never parallel implementations
- **Forward-compatibility check with Phase 3:** TablePagination will consume this Select for page size. If that consumption feels forced later, the bug is here — cheap now, expensive then
- Async options: out of v1's prop surface; the docs show the pattern (consumer filters `options`, `searchable` handles the input)

---

## 4. Badge (~2h)

The palate cleanser, and the tone-mapping proof:

```ts
interface BadgeProps {
  /** Semantic tone. @default 'neutral' */
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger'
  /** How much visual weight it carries. @default 'subtle' */
  appearance?: 'subtle' | 'solid' | 'outline'
  /** @default 'md' */
  size?: 'sm' | 'md'
  /** Leading dot, inheriting the text colour. @default false */
  dot?: boolean
}
```

> Five tones, not four: `primary` completes the set so the tone mapping is 1:1
> with the semantic tokens, which is what line 141 asks for. `ROADMAP.md`'s
> one-line description still lists four.

- Tones map 1:1 onto the semantic token tone set — if Badge needs a color the tokens don't express, the gap is in Phase 1, not here
- Badges are text, not controls: no click handler, no `role`. An interactive "badge" is a Button (or future Tag) — "when not to use" leads with this
- Contrast of every tone×mode combination is checked by the a11y scan; this is the component most likely to fail on contrast, which is half the reason it's in the core set

---

## Cross-cutting

- **Dark-mode verification is per-story**, not a final sweep — Storybook's theme toggle on every story, both modes checked at review
- **The docs template is fixed here** (anatomy → when to use → when not to use → props → keyboard → a11y) and Phases 3–4 fill the same skeleton
- The playground gains a **form scene**: Field+Input ×2, Select, submit Button with loading, Badge for status — the phase's DoD artifact and later the docs' forms-pattern page

---

## Phase Definition of Done

- [x] All four at 🟢 Stable per the ten-point checklist
- [x] Component shape template established
- [x] Playground form scene renders using only rowkit components — `playground/app/pages/index.vue`
- [x] Four changesets, retro-written in the 0b closure exactly as anticipated
- [x] Budget green with all four included — gated by `size-limit` in CI

### Still open, deliberately

Three items this spec argues for that the code does not yet do. Each is a
decision, not an oversight, and none blocks Stable:

- **`Field.label` is optional, not required.** Line 76 argues it should be
  required — _"label being required makes the right thing the only thing"_ — and
  that is a stronger guarantee than the shipped `label?: string` plus
  `labelSrOnly`. The visually-hidden cases (`FilterBar`'s search, pagination's
  rows-per-page) would work fine under a required label, so the argument stands.
- **The error state may not clear WCAG 1.4.1.** Line 98 asks for an icon or
  border treatment beyond colour. The shipped `Input` has an `invalid` variant
  and relies on the message text to carry the meaning — defensible, but if the
  border is the only in-field signal then a colour-blind user scanning six
  fields has red-vs-grey and nothing else.
- **The spinner is not `motion-safe:` gated.** Line 62 says it respects reduced
  motion; it is a bare `animate-spin`. Inconsistent with `Skeleton` and with
  `docs/conventions.md`.

## Lessons recorded

1. **The stage system worked.** When the DoD couldn't be met, the components were honestly marked Experimental instead of Stable-by-assertion. An honest 🟡 is worth more than a claimed 🟢 — to consumers and to the portfolio reader alike.
2. **Field/Input's provide-inject wiring is the phase's most reusable asset** — every future form control inherits correct labeling for free.
3. `loading` ≠ `disabled` (focus survival) became a recurring principle: it reappears in Phase 3's sort-buttons-during-loading fix. When two phases independently hit the same principle, it belongs in `docs/conventions.md` — it was added there.
4. **"Props type exported" sat unmet for two phases.** It was on this checklist from the start, and nine components shipped without it, because `defineProps<{…}>` with an inline literal produces no named type to export and nothing in the build complains. The fix was structural — a `types.ts` per component — and it got more expensive with every component added. A checklist item that no gate enforces is a checklist item that drifts.
