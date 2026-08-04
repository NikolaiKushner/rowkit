---
'rowkit': minor
---

Finish the form and filter surfaces.

**Select** takes the Input treatment on its trigger — `bg-transparent`, `shadow-xs`, `disabled:opacity-50` — and drops the hover fill, which shadcn's trigger does not have. The popup moves from `shadow-lg` to `shadow-md`, and its items gain `rounded-sm` so the highlight is a rounded band rather than a full-bleed stripe. Invalid tints the focus ring as well as the border.

**Field** hint and error text grow to `text-sm` at the default size, matching shadcn's, and the error takes the destructive fill colour rather than the badge-text one. A disabled label fades instead of switching to a disabled colour token.

**FilterBar** chips are now shadcn `secondary` badges: neutral fill, `rounded-md`, `text-xs`, `font-medium`, with the remove control down to `size-3.5`/`size-4`. They were the last surface still using raw surface tokens for something that is conceptually a badge.
