---
'rowkit': minor
---

**Breaking (Tooltip).** `Tooltip` is now a set of parts. The `content` prop and the default slot are gone, and `placement` moves to `TooltipContent`.

Place `TooltipTrigger` and `TooltipContent` yourself. The label is the content slot, and it is text. `delay` and `disabled` stay on `Tooltip`. A lone tooltip still supplies its own provider; `TooltipProvider` is unchanged, including `skipDelayDuration`.
