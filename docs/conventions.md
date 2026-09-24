# API conventions

A rowkit component is a constructor. The consumer's template is the
composition: they place the parts, and the arrangement is the variant. A prop
that hides a header, swaps a mode, or draws a second layout is the thing this
document exists to prevent.

These rules are decided once. A component that cannot follow one says so on its
docs page, with the reason.

The assemblies still to rebuild — `Toaster` and `Field` — are single components
with slots. They get rebuilt to this shape one at a time. Until a component's
docs show the parts, the code is the previous shape, and this file is the one
it is moving toward.

---

## Two shapes

**One element stays one component.** `Button`, `Badge`, `Input`, `Skeleton`,
`EmptyState`. There is nothing to arrange. Splitting them into parts would
invent a constructor that has only one piece.

**Anything with parts the consumer places is an assembly.** `Dialog`, `Select`,
`Tooltip`, toast, and the menus and popovers that follow. Also the form chrome
around a control: label, hint, and error are parts, and the control itself is
whatever the consumer puts inside.

`DataTable`, `FilterBar`, and `Pagination` are widgets. They compose the parts
above. They are not themselves split into a trigger and a content, because
their job is the data contract — typed columns, the page model — not a second
way to write a `<table>`.

---

## Anatomy

Taken from Reka UI, which rowkit already builds on, and from the way shadcn-vue
styles those parts without replacing them.

**The root owns the shared state and renders no chrome.** It forwards to the
Reka root (`DialogRoot`, `SelectRoot`) and `provide`s the context the parts
read. File and export name drop the `Root` suffix: `Dialog.vue` exports
`Dialog`. The consumer never imports `DialogRoot`.

**One file per part the consumer places.** `DialogTrigger.vue`,
`DialogContent.vue`, `DialogTitle.vue`. A part either forwards a Reka part or
is layout only (`DialogHeader`, `DialogFooter`: a `div` and a slot, no
behaviour). Behaviour — focus trap, dismiss, typeahead, scroll lock — stays
inside Reka.

**Abstract the parts that always travel together.** This is Reka's own "Custom
APIs" guidance, not a shortcut around it. `DialogContent` includes the portal,
the overlay, and the close button, so a consumer writes `Dialog`,
`DialogTrigger`, and `DialogContent`. Title, description, header, and footer
stay parts, because those are what changes from one dialog to the next. A
`mode` prop that redraws the layout is the thing to avoid. A part that must
exist for accessibility (a dialog title) is required in the docs, not invented
as a flag on the root.

**`as` and `as-child` on every part that renders an element the consumer may
replace.** Triggers are the usual case: `DialogTrigger` with `as-child` hands
its behaviour to the `Button` inside it, so a dialog opens from the same button
the rest of the page uses. Parts compose the same way with each other — a
tooltip trigger around a dialog trigger around a button.

**Props and emits of a Reka part are forwarded**, not re-declared one by one.
`useForwardPropsEmits` from Reka. rowkit adds `class` and a few opinions of its
own, such as a dialog content's `size`.

**Open state follows Reka.** `v-model:open` on the root when the consumer needs
the value. With no model, the root holds it, so a trigger still toggles. Data
state is different and stays fully controlled: sort, selection, page, filters.
There is no correct default for those, and a component must not guess. See
State ownership.

```vue
<Dialog>
  <DialogTrigger as-child>
    <Button>Delete project</Button>
  </DialogTrigger>
  <DialogContent size="sm">
    <DialogHeader>
      <DialogTitle>Delete project</DialogTitle>
      <DialogDescription>This cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogBody>Everything in the project goes with it.</DialogBody>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

`index.ts` exports the parts a consumer places. Portal and overlay, once they
live inside `DialogContent`, do not need their own export.

---

## File structure

A single-element component:

```
components/Button/
  Button.vue
  Button.variants.ts
  Button.stories.ts
  Button.test.ts
  index.ts
  types.ts          # only when <script setup> cannot export the type
```

An assembly, same folder. One Vue file for each part the consumer places.
Portal and overlay can live inside `DialogContent.vue` rather than as their
own public files. One variants module, one story file, one test file:

```
components/Dialog/
  Dialog.vue
  DialogTrigger.vue
  DialogContent.vue
  DialogTitle.vue
  DialogDescription.vue
  DialogHeader.vue
  DialogBody.vue
  DialogFooter.vue
  Dialog.variants.ts
  Dialog.stories.ts
  Dialog.test.ts
  index.ts
```

Variants for every part live in that one `cva` module. A long class string in a
template is still forbidden.

---

## Props

**Booleans read as adjectives, no `is` prefix.** `disabled`, `loading`,
`required`. Never `isDisabled`.

**Boolean props default to `false`.** Where the useful default is on, name the
opt-out: `static`, not `animated: true`.

**Variants are strings.** `variant="destructive"`, never a boolean `destructive`.
Two booleans can both be true, and that state means nothing.

**Sizes share one scale.** Form controls: `sm | md | lg`, default `md`.
`Button` keeps the shadcn set (`default | xs | sm | lg | icon | icon-xs |
icon-sm | icon-lg`); `default` is the same height as `md` elsewhere (`h-8`).
No component invents a new step name.

**Every part accepts `class` and merges it** through `tailwind-merge`. The
consumer's utility wins.

**Every prop has a JSDoc comment** that says why it exists. These feed the docs
tables (`pnpm docs:props`) and `AGENTS.md` (`pnpm docs:agents`). The first
paragraph is the table cell. The same comment is required on `defineModel`,
`defineEmits`, and `defineSlots` members.

### `exactOptionalPropertyTypes`

- `withDefaults` cannot list an explicit `undefined`. Omit the entry.
- `:foo="undefined"` is a type error. Build the object and spread only when the
  value is present. This is the normal pattern, used wherever a prop is optional
  and forwarded.

---

## State ownership

**The consumer owns data state.** Sort, selection, page, page size, filters,
search are `v-model` on the widget. Nothing is held inside. Changing the page
size does not move the page. Clearing a filter does not reset anything else.
The component reports what happened.

**An assembly root owns presence state** — open, closed — the way Reka does.
Bind `v-model:open` to take it. Leave it unbound and the root keeps it, which
is what makes a trigger work without a ref in the page. Do not add a second
boolean prop for the same fact.

Convenience that is really a policy lives **outside** the component.
`useClientSort` used to be a `sortMode` prop. A prop made the wrong mode
reachable by accident: a server-paged table that sorts locally looks correct
and is not.

---

## Events

**Past tense for things that happened:** `@select`, `@remove`, `@clear`.

**`update:<name>` for every model.** `v-model:open`, `v-model:page`,
`v-model:sort`.

**The payload is the value**, not the DOM event, unless the event itself is the
information. `@remove` emits the chip's `id`.

**Identity is a stable id.** Never an array index, never an object reference.
An index stops being an identity the moment the list sorts, and a reference
does not survive a refetch.

---

## Slots

A slot is the content of a part. It is not a way to swap one part for another.
`DialogHeader` is a component the consumer places. It is not a `#header` slot
on a single `Dialog`.

**`default` is the part's content.** A part with no single place for content
has no default slot.

**Scoped slots pass the minimum, typed.** A menu item passes the item. A table
cell passes `{ row, column, value, index }`. Nothing else.

**Per-item slots on a widget stay namespaced with a colon:** `#cell:status`.
Specific, then general, then the built-in default.

---

## Types

**Each part exports its props type.** So does any type the consumer needs for
their own state: `SelectOption`, `DataTableColumn`, `DataTableSort`.

**Types a `<script setup>` block cannot export live in `types.ts`.**

**One type parameter, named for the domain.** `DataTable<TRow>`, not
`DataTable<T>`.

**No `any`.** `unknown` and a narrowing predicate. See `isFieldColumn`.

---

## Accessibility

The wiring comes from the Reka part a rowkit part forwards. A part that renders
its own element still follows these.

**Decorative by default, announced on request.** A badge dot, a sort icon, an
ellipsis: `aria-hidden`. `Skeleton` is `aria-hidden` always.

**One live region per concern, mounted before it has something to say.** A
region added in the same tick as its text is often silent. `DataTable` keeps
an empty `role="status"` and changes only the text.

**Landmarks have names, and two of them on one page have different names.**
`label` exists for this. Two paginations both called "Pagination" fail axe.

**Name a control after what it acts on.** "Remove Role: Admin filter", not
"Remove".

**Focus survives destruction.** Removing the focused element moves focus to the
next sibling, then a nearby control, then the region. Never to the top of the
document.

**A busy control is `aria-busy`, not `disabled`, while it holds focus.**
Disabling it pulls the user out of the interface by their own action.

**Ambient motion is behind `motion-safe:`.** A loop that is the only signal
something is happening stays, small and non-parallax, and the state also
reaches assistive technology another way. `Button`'s spinner is that case,
paired with `aria-busy`. `styles/motion.test.ts` fails an ungated `animate-*`
that is not on that exemption list with a written reason.

---

## Styling

**No hardcoded design values.** Colour, space, radius, shadow, z-index: a
token. A missing token is a proposal, not an inlined value. `1em` and `w-full`
track something else and are fine.

**`data-slot` on every part.** The value is the part's kebab name:
`data-slot="dialog"`, `data-slot="dialog-title"`, `data-slot="field-error"`.
This is the public styling hook. Class strings are not, and they may change.

**`data-state` comes from the primitive** (`open` | `closed`, `checked`,
`disabled`). rowkit does not invent a parallel class for the same fact.
Consumers style with `data-[state=open]:` and `has-[[data-slot=dialog-footer]]:`.

**Variants are `cva` in `ComponentName.variants.ts`.** Class names are written
out in full. Tailwind scans source for literal strings; `` `bg-${variant}` ``
generates nothing and throws nothing. Two axes of colour go in
`compoundVariants`. `styles/variants.test.ts` compiles the real stylesheet and
fails a class that produced no output.

---

## Bundle budget

`size-limit` in CI, brotli. Ceilings are in `.size-limit.json`. One entry
imports a single component, so a barrel that defeats tree-shaking fails before
it ships. An assembly's parts are exported from the folder `index.ts`;
importing `DialogTitle` must not pull `DataTable`.

---

## Changesets

Every public API change needs one. `pnpm changeset`. Describe what changed for
the consumer. Rebuilding an assembly from a single component into parts is a
breaking change and needs a major changeset on purpose, not a patch taken while
doing something else.
