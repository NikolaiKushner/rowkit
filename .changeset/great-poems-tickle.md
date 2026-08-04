---
'rowkit': minor
---

Adopt shadcn/ui's focus ring, and restyle Button, Badge and Skeleton.

The focus ring is the language's most recognisable detail: the border turns the ring colour **and** a 3px ring at 50% opacity appears outside it. Both halves are load-bearing — the ring is translucent and cannot carry 3:1 on its own, so the solid border is what satisfies WCAG 1.4.11 and the ring is what makes it read as focus rather than hover. This replaces the previous `outline-2 outline-offset-2` rather than joining it; two indicators on one element is noise.

Button takes shadcn's geometry: `rounded-md` at every size, `lg` at `px-6`, and `text-sm` throughout — shadcn does not enlarge type on a larger button. Disabled is now `opacity-50` instead of swapping to disabled colour tokens.

Badge is `rounded-md` with `text-xs` at both sizes. Skeleton is a single `rounded-md` shape at every geometry preset.

Two places where the written spec and shadcn's source disagreed, resolved in favour of the source: the transition is `transition-all`, not `transition-[color,box-shadow]`, and `lg` is `px-6`, not `px-5`.

The ring width comes from Tailwind's scale as `ring-3` rather than shadcn's arbitrary `ring-[3px]`, and the compile test asserts all three focus utilities resolve — a utility that generates nothing is this project's recurring failure mode.
