# Skeleton

**Stage:** 🟢 Stable

A loading placeholder shaped like the content it stands in for. Built to be
composed — the primitives are a bar, a circle and a block, and you arrange them
into the layout that is arriving.

```vue
<Skeleton :lines="3" />
```

## Anatomy

| Part      | Purpose                                                           |
| --------- | ----------------------------------------------------------------- |
| Container | The placeholder itself, or a wrapper when `lines > 1`             |
| Bar       | One line of the stack. The last is shortened so it reads as prose |
| Pulse     | Ambient animation, suppressed under `prefers-reduced-motion`      |

## When to use

- Waiting on content whose **shape you already know** — a table of a known
  column count, a card with an avatar and two lines.
- Loads long enough to notice but short enough to wait through, roughly 300ms
  to a few seconds.
- Anywhere a spinner would cause the layout to jump when the data lands.

## When not to use

- **When you don't know the shape.** A placeholder that doesn't match what
  replaces it produces exactly the layout jump it was meant to prevent. A
  spinner is more honest.
- **For loads under ~300ms.** The skeleton flashes in and out, which reads as a
  glitch. Render nothing.
- **For long or indeterminate waits.** Past a few seconds a skeleton looks like
  a broken page. Use a progress indicator, and say what is happening.
- **As an empty state.** A skeleton means "content is coming". If there is no
  data, say so — use `EmptyState`.
- **After an error.** A skeleton that never resolves is the worst possible
  failure message. Swap it for the error.
- **One per cell, labelled.** A labelled skeleton announces itself. Thirty of
  them announce thirty times. Label the region, not the parts.

## Props

| Prop       | Type                           | Default  | Description                                                       |
| ---------- | ------------------------------ | -------- | ----------------------------------------------------------------- |
| `variant`  | `'text' \| 'circle' \| 'rect'` | `'text'` | Geometry preset                                                   |
| `lines`    | `number`                       | `1`      | Stacked bars. Only meaningful for `text`                          |
| `animated` | `boolean`                      | `true`   | Pulse. Suppressed for reduced-motion users regardless             |
| `label`    | `string`                       | —        | Announces this element as a busy region. Omit for decorative bars |
| `class`    | `string`                       | —        | Merged so your utility wins over the component's                  |
| `as`       | `string \| Component`          | `'div'`  | Element to render                                                 |
| `asChild`  | `boolean`                      | `false`  | Merge props onto the child instead of wrapping                    |

Sizing beyond the presets goes through `class` — `<Skeleton class="h-24 w-1/3" />`.
The variant defaults are merged away rather than fought with, so there is no
specificity battle.

## Keyboard

None. A skeleton is not interactive and is not in the tab order. It is replaced
by real content, and focus should land on that content, not on the placeholder.

## Accessibility

The default is **silence**: an unlabelled skeleton is `aria-hidden="true"`. This
is deliberate. A loading table renders dozens of placeholders, and a screen
reader that announces each one is unusable.

Announce the **region** instead. Either set `label` on the single element
standing for the whole area, or wrap the group yourself:

```vue
<div role="status" aria-busy="true" aria-label="Loading users">
  <Skeleton v-for="row in 5" :key="row" />
</div>
```

`label` produces `role="status"` with `aria-busy="true"` — the role makes it a
live region, and `aria-busy` is what states the content is still arriving.

**Motion.** The pulse is `motion-safe:` only, so it never renders for anyone who
has asked for reduced motion. A looping animation is the kind that triggers
vestibular symptoms, and it carries no information the static shape does not.
`animated: false` turns it off for everyone.

**Contrast.** The `skeleton` token is exempt from contrast requirements. The
placeholder is decorative and hidden from assistive technology, so there is no
content to perceive — WCAG 1.4.11 applies to UI component boundaries and
meaningful graphics, and this is neither.

**Animation timing** does not come from the motion tokens. Those cap at 320ms
because they describe interaction feedback, where anything slower reads as lag.
An ambient loop is a different thing and runs at Tailwind's 2s `animate-pulse`.

## Dark mode

The fill lifts off the surface rather than receding: `neutral-800` against a
`neutral-900` card. A placeholder darker than the surface it sits on reads as a
hole in the layout instead of as content on its way.
