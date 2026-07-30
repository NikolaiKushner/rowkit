---
'rowkit': minor
---

Add `Tooltip`, built on Reka UI's primitive. It opens on hover **and** on keyboard focus, dismisses with Escape without moving focus, and stays open while the pointer travels onto it — the two halves of WCAG 1.4.13. The trigger is rendered `as-child`, so your element becomes the trigger rather than being wrapped.

`content` is typed as a `string` with no slot alternative, deliberately: a tooltip never holds focus, so an interactive element inside one is unreachable by keyboard by construction, and the type closes that failure class at the API boundary. Also re-exports Reka's `TooltipProvider` for the shared grace period that lets a pointer sweep a toolbar without re-paying the delay; a lone `Tooltip` supplies its own provider and defers to a real one when present.
