---
'rowkit': patch
---

rowkit's behaviour layer is now entirely original code. The primitives that had been ported from Reka UI — focus scope, dismissable layer, presence, body scroll lock, hide-others, `as` / `as-child`, the tri-state checkbox, the page range — and the toast and tooltip behaviour are rewritten from scratch against the same tests, so `THIRD_PARTY_NOTICES.md` is no longer shipped. Public APIs and rendered output are unchanged.

A few edge cases behave slightly differently:

- A pointer pressed outside stacked layers closes every layer it is outside of, from the top down, stopping at a modal layer. Hovering a tooltip inside a dialog and then clicking the page now closes both, not just the tooltip. Escape still closes one layer at a time.
- An endless animation on an overlay's surface (a spinner on the dialog itself, say) no longer keeps the overlay mounted after it closes.
- A dismissed toast now plays the `data-state="closed"` exit animation its styles always declared, instead of vanishing at once. It leaves the queue immediately, so the next toast moves up without waiting, and it is `inert` while it fades.
- A `Tooltip` inside a `TooltipProvider` now waits the provider's `delayDuration`, as documented, rather than its own `delay`. On its own, `delay` still sets the timing.
- An open tooltip closes when the page scrolls, instead of drifting away from its trigger.
