---
'rowkit': minor
---

Add `Field` and `Input`.

`Field` owns the label, hint, error and required state, generates the control id,
and wires `aria-describedby` — listing the hint before the error, so guidance is
read before the correction. The presence of `error` is what puts the field into
its invalid state; there is no separate flag to keep in sync. The error is a
`role="alert"`, so a message that appears after submit is announced without the
user going looking for it.

`Input` inherits `disabled`, `invalid` and `required` from a surrounding `Field`
by **OR**, not by fallback — a `Field` can turn them on, a control cannot turn
them back off. This mirrors `<fieldset disabled>` and sidesteps a Vue trap: an
absent boolean prop is cast to `false`, not `undefined`, so a `??` chain would
read the prop's default and never consult the field at all.

Both work standalone; a bare `Input` outside a `Field` is supported.

_Recorded retroactively — this work predates Changesets being installed._
