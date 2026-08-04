---
'@rowkit/tokens': minor
'rowkit': minor
---

Blur the dialog scrim, and assert the focus trap.

The overlay gains a backdrop blur behind `supports-[backdrop-filter]:`, so the page reads as context rather than a flat grey field. The guard matters: `backdrop-filter` is missing or disabled in more places than its support table suggests, and unguarded it degrades to a plain scrim on some machines and not others. Everyone gets the scrim; the blur is the enhancement.

New `blur` token scale in `@rowkit/tokens` — one entry, `--blur-overlay`, named for its job. The scrim also moves from a raw `neutral-950` primitive to the `shadow` semantic token.

shadcn ships two overlays and they differ: its default is `bg-black/50` with no blur, while its named styles use `bg-black/80` with `backdrop-blur-xs`. rowkit takes the blur at the default's 50%, because blur plus 80% black is nearly opaque and defeats the reason to blur at all.

Three keyboard behaviours are now tested rather than assumed: Tab cycles inside the dialog and cannot reach the page behind it, Shift+Tab holds in the same way, and one full lap of Tab returns focus where it started. A focus trap that stops trapping changes nothing about the rendered output — the dialog still looks modal while a keyboard user tabs out and operates the page underneath.
