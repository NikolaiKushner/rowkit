---
'rowkit': minor
---

**`Toaster` moves off Reka UI, with three deliberate behaviour changes.** Released as a `minor` while rowkit is on 0.x.

- **Escape closes only the toast that holds focus.** Previously any Escape on the page — including the one that closed a dialog — dismissed every toast.
- **Toasts render newest first in the DOM**, so Tab and screen-reader order start at the toast that just arrived. The visual stacking per `position` is unchanged. Tests that query toasts by index may need updating.
- **Announcements go through one persistent `role="status"` region** instead of an element inserted per toast, which screen readers often missed.

Also: the swipe offset custom property is now `--rk-toast-swipe-x` (was `--reka-toast-swipe-move-x`); the toast region no longer renders `aria-hidden` focusable guards, so axe's `aria-hidden-focus` rule passes and is re-enabled; and clicking a toast while a `Dialog` is open no longer counts as a click outside it.
