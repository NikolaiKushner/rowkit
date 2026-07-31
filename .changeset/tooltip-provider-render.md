---
'rowkit': patch
---

Fix `Tooltip` rendering nothing when it is inside a `TooltipProvider`.

A `<Tooltip>` with a provider above it — the arrangement the docs recommend for
a toolbar, so `skipDelayDuration` lets the pointer sweep across a row of icon
buttons — rendered no tooltip **and no trigger**. The button simply was not on
the page, with no error and no warning.

The internal pass-through wrapper was Vue's `Fragment`, which `<component :is>`
hands a slots object where it expects an array of vnodes. If you worked around
this by dropping the provider, you can put it back; a tooltip without one is
unaffected and always worked.
