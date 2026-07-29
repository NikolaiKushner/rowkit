# 003 — Cell slot typing: the fallback, and why

**Status:** accepted
**Decided:** Phase 3, session 3.3. Investigated rather than assumed.

## Decision

`DataTable` types its per-column cell slots as an index signature over
`` `cell:${string}` ``, with the slot props carrying `value: unknown`:

```ts
defineSlots<
  {
    cell?: (props: CellSlotProps) => unknown
    empty?: () => unknown
    loading?: () => unknown
  } & Record<`cell:${string}`, ((props: CellSlotProps) => unknown) | undefined>
>()
```

Not the mapped type the phase spec proposed, which would have given each column
its own precisely-typed `value`:

```ts
// The version that does not work.
defineSlots<{
  [K in Extract<keyof TRow, string> as `cell:${K}`]?: (props: {
    value: TRow[K]
    row: TRow
  }) => unknown
}>()
```

## What was tried

The mapped type was written and compiled against the real component. It fails,
and not in `vue-tsc`'s language tooling — in plain type checking:

```
error TS7053: Element implicitly has an 'any' type because expression of type
'`cell:${string}`' can't be used to index type '{ [K in Extract<keyof TRow, string>
as `cell:${K}`]?: ... }'
```

## Why it cannot work here

The phase spec anticipated a **tooling** limitation — open language-tools issues
around template-literal slot names plus generics. The actual blocker is more
fundamental than that, and no amount of tooling progress fixes it.

A mapped type is keyed by **specific literals**: `cell:name`, `cell:email`,
`cell:seats`. Rendering it requires the template to name each slot statically.
But `DataTable` renders columns from a runtime array:

```vue
<slot :name="`cell:${columnId(column)}`" …>
```

`columnId()` returns `string`, so the slot name's type is `` `cell:${string}` ``
— a template-literal pattern, not a literal. TypeScript cannot prove that value
is one of the mapped keys, because at the type level it genuinely isn't: the
column list is data, and the compiler has no idea which columns exist at the
call site.

**The two requirements are in direct conflict.** Per-column typed slots need
statically known keys; data-driven columns need a dynamic slot name. You can
have either, not both, as long as columns are a runtime array — which is the
whole premise of the component.

The workarounds all give the win back. An index signature added to the mapped
type erases the per-key precision. Casting the slot name in the template
discards the check at exactly the point it would have to hold. Requiring
`columns` to be `as const` and inferring literal keys would make every consumer
declare their columns inline and give up the array as data.

## What is kept

`key` on a column is still `Extract<keyof TRow, string>`, so a mistyped column
is a compile error — verified with a probe that TypeScript rejects both
`{ key: 'nmae' }` and a keyless column with no `id`. `DataTableSort<TRow>` is
keyed the same way. **The typing win the phase wanted is in the column
definitions, and it survived intact.** Only the slot props are loose, and a
consumer who wants precision writes one line:

```vue
<template #[`cell:seats`]="{ row }">{{ row.seats * 12 }}</template>
```

`row` is fully typed as `TRow`, so reading the field off the row rather than
using `value` gets the type back with no cast.

## Revisit when

TypeScript can relate a template-literal-typed index to a mapped type's keys,
or Vue offers a way to declare slot names from a value. Neither is on any
roadmap, and the constraint is a real one rather than a gap — so treat this as
settled. **Working DX beat impressive types**, which is what the phase spec
asked for when the two conflicted.
