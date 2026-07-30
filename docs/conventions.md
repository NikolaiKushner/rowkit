# API conventions

Consistency across twelve components is what makes a library feel designed
rather than assembled. These are decided once, here, and every component follows
them. Where a component deviates, its docs page says so and why.

---

## Props

**Booleans read as adjectives, no `is` prefix.** `disabled`, `loading`,
`required`, `searchable`, `hoverable` — never `isDisabled`.

**Boolean props default to `false`**, so the absent prop and the off state are
the same thing. Where the useful default is "on", name the prop for the
_opt-out_ rather than inverting the default — `static`, not `animated: true`.

**Variants are strings, not booleans.** `variant="danger"`, never `danger`. A
boolean per variant makes two of them expressible at once, and that state has no
meaning.

**Sizes use one scale across every component**: `sm | md | lg`, `md` the default.
A component may offer a subset — `Badge` and `DataTable` stop at `sm | md`,
because a large table row is not a thing anyone wants — but it never renames the
steps.

**Every component accepts `class` and merges it** through `tailwind-merge`, so a
consumer's utility wins over the component's own without a specificity fight.

**Every prop carries a JSDoc comment.** These feed the docs site and `AGENTS.md`.
A comment that restates the prop name is worse than none — say why it exists or
when to reach for it.

### Optional props and `exactOptionalPropertyTypes`

TypeScript is strict, and `exactOptionalPropertyTypes` is on. Two consequences
that come up constantly:

- `withDefaults` cannot list an explicit `undefined` default. Omit the entry.
- Binding `:foo="undefined"` to an optional prop is a type error, not an
  omission. Build the props in a computed and spread conditionally:

  ```ts
  const rootProps = computed(() => ({
    ...(props.name === undefined ? {} : { name: props.name }),
  }))
  ```

  `Select`, `DataTable` and others all do this. It is the standard workaround,
  not a local hack.

---

## State ownership

**The consumer owns state; components render it and request changes.** Sort,
selection, page, page size, filters, search — all `v-model`, none owned
internally. This is what makes server-driven and client-driven usage identical
from the component's point of view.

The consequence worth stating: a component **does not** make multi-step
decisions on the consumer's behalf. Changing page size does not silently move
the page; clearing a filter does not silently reset anything. The component
emits what happened and the application decides what follows.

Where convenience genuinely helps, it lives **outside the component** rather than
behind a prop. `useClientSort` is the case: client-side sorting used to be a
`sortMode` on `DataTable` and was moved out, because a prop makes the wrong mode
reachable by accident — a server-paged table that sorts locally reorders only the
page on screen and looks correct.

---

## Events

**Past tense for things that happened**: `@change`, `@select`, `@close`,
`@remove`, `@clear`.

**`update:<name>` for every model.** Multiple models are normal:
`v-model:page`, `v-model:pageSize`, `v-model:sort`, `v-model:selected`.

**The payload is the value, not the DOM event**, unless the event itself is
genuinely needed. `@remove` emits the chip's `id`, not a `MouseEvent`.

**Identity payloads use stable ids, never array indices or object references.**
An index is not an identity once a list can sort or filter, and an object
reference does not survive a refetch.

---

## Slots

**`default` for content**, where the component has a single content area.
Components with a fixed internal layout — `EmptyState`, `FilterBar` — have no
`default` slot at all, because there is no unambiguous place to put it.

**Named slots describe role, not position**: `#controls`, `#actions`, `#empty`,
`#icon`, `#summary`, `#chip`.

**Scoped slots pass the minimum useful data, typed.** `DataTable`'s cell slots
pass `{ row, column, value, index }` and nothing else.

**Per-item slots are namespaced with a colon**: `#cell:status`. The resolution
order is always specific, then general, then a built-in default.

---

## Types

**Every component exports its props type**, and any type a consumer needs to
annotate their own state: `SelectOption`, `FilterChip`, `DataTableColumn`,
`DataTableSort`.

**Types a `<script setup>` block cannot export live in `types.ts`** beside the
component. `<script setup>` cannot export types; this is not optional.

**Generic components use one type parameter named for the domain**:
`DataTable<TRow>`, not `DataTable<T>`.

**No `any`.** If typing is genuinely hard, ask rather than escaping the type
system. `unknown` with a narrowing predicate is almost always the answer — see
`isFieldColumn` in `DataTable/types.ts`.

---

## Accessibility conventions

These recur often enough to be conventions rather than per-component decisions.

**Decorative by default, announced on request.** Anything that repeats
information already present is `aria-hidden`: `Badge`'s dot, `TablePagination`'s
ellipsis, `DataTable`'s sort icon. `Skeleton` is `aria-hidden` unconditionally
and has no say in the matter — a loading table renders dozens of them.

Where a region needs to announce itself, that is an explicit opt-in on **one**
element that stands for the whole region — `EmptyState`'s `announce`,
`DataTable`'s loading status — never on every instance.

**Live regions are rendered before they have something to say.** A region added
to the DOM at the same moment as its content is frequently not announced.
`DataTable` keeps an empty `role="status"` mounted and changes only its text.

**Every landmark takes a name, and concurrent instances need distinct ones.**
Two `<nav>`s both called "Pagination" is an axe `landmark-unique` violation, and
it is the normal layout for a long table. `label` props exist for this.

**Controls are named after what they act on**, not what they do. "Remove Role:
Admin filter", not "Remove". "Select Ada Lovelace", not "Select row 3".

**Focus survives destruction.** Removing the element that has focus must move
focus somewhere sensible — the next sibling, then a nearby control, then the
region — never to the top of the document. See `FilterBar`'s chip removal.

**Never disable a control that has focus mid-request.** Use `aria-busy` and make
the handler a no-op instead, so a keyboard user is not thrown out of the
interface by their own action.

**Motion is opt-out at the system level — with one distinction.** An **ambient**
loop is gated behind `motion-safe:`: it carries no information, so removing it
costs nothing. `Skeleton`'s pulse is the example.

A loop that is **the only thing telling the user something is happening** is
exempt, deliberately and by name. `Button`'s spinner is the example: gating it
would not reduce motion, it would remove the signal, leaving a reduced-motion
user with a static ring that means nothing. Such an animation must stay small,
centred and non-parallax — the shapes WCAG 2.3.3 concerns itself with are
large-area and parallax — and the state must also reach assistive technology by
another route, which for `Button` is `aria-busy`.

`styles/motion.test.ts` enforces this: an ungated `animate-*` anywhere in a
component fails unless it is in that file's exemption list with a written
reason. Transitions are not covered — a 120ms colour fade on hover is not the
concern.

---

## Styling

**No hardcoded design values.** Every colour, spacing value, radius, shadow and
z-index references a token. If no token fits, propose one — `skeleton` was added
exactly this way. Relative units that track something else (`1em` tracking font
size, `w-full`) are not design values and are fine.

**Variants live in `ComponentName.variants.ts`, defined with `cva`.** Never a
long class string in the template.

**Class names are written out in full.** Tailwind finds utilities by scanning for
literal strings, so `bg-${variant}-subtle` is valid TypeScript that generates
no CSS at all. Colour that is the product of two axes goes in `compoundVariants`.

**Every variant is covered by `styles/variants.test.ts`**, which compiles the
real stylesheet and asserts each class produces output. A class that generates
nothing is not an error anywhere else in the toolchain.

---

## Bundle budget

Measured with `size-limit` in CI, in **brotli** — `plan.md`'s original 15 kB /
45 kB figures were gzip, and brotli runs roughly 10–15% smaller, so the numbers
are not directly comparable. Current ceilings are in `.size-limit.json`.

One entry deliberately imports a single component, so a barrel change that
breaks tree-shaking fails CI rather than quietly shipping the whole library to
someone who wanted a `Button`.

---

## Changesets

Every public API change needs one. `pnpm changeset`, pick the packages, describe
the change the way a consumer reading a changelog would want it described — what
changed and what it means for them, not which files moved.
