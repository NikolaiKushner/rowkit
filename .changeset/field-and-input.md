---
'rowkit': minor
---

Add `Field` and `Input`. `Field` owns the label, hint, error and required state, generates the control id and wires `aria-describedby` with the hint before the error; `Input` inherits those flags from a surrounding `Field` by OR rather than fallback, so a field can turn them on and a control cannot turn them back off — which also sidesteps Vue casting an absent boolean prop to `false` rather than `undefined`.

_Recorded retroactively — this work predates Changesets being installed._
