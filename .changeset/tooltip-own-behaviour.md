---
'rowkit': minor
---

**`Tooltip` and `TooltipProvider` move off Reka UI.** Released as a `minor` while rowkit is on 0.x, because the markup changes.

- The bubble is now the `role="tooltip"` element that `aria-describedby` points at. The visually hidden copy of the text that Reka rendered inside it is gone, so the description exists once. Tests that looked for the inner span should query the bubble.
- `TooltipProvider` is rowkit's own, with the same props (`delayDuration`, `skipDelayDuration`, `disableHoverableContent`, `disableClosingTrigger`, `disabled`, `ignoreNonKeyboardFocus`) and defaults as before.
- Positioning is rowkit's own: preferred side with a 4px gap, flipped to the opposite side when it does not fit, slid along the edge to stay on screen. `data-side` still reports the side used.
