---
'rowkit': minor
---

Bring pagination controls back to a 32px square.

`md` page items go from `h-9 min-w-9` to `h-8 min-w-8`, `sm` from `h-8` to `h-7`, and the corner from `rounded-md` to `rounded-lg`, matching the reference.

The previous release had chased Button's height on the grounds that both are controls. That was the wrong comparison: a page number is not a button you press once, it is one cell of a strip of eight, and at 36px that strip outweighs the table it pages through.
