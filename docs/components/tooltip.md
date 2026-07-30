# Tooltip

**Stage:** 🟢 Stable

A label for a control, on hover and on focus. Built on Reka UI's `Tooltip`.

```vue
<Tooltip content="Archive project">
  <Button variant="ghost" aria-label="Archive project">
    <ArchiveIcon />
  </Button>
</Tooltip>
```

## Props

| Prop        | Type                                     | Default | Description                         |
| ----------- | ---------------------------------------- | ------- | ----------------------------------- |
| `content`   | `string`                                 | —       | Required. The label. String only    |
| `placement` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Preferred side. Flips on collision  |
| `delay`     | `number`                                 | `300`   | Milliseconds before opening         |
| `disabled`  | `boolean`                                | `false` | Off, without unwrapping the trigger |

### Slots

| Slot      | Description                                                      |
| --------- | ---------------------------------------------------------------- |
| `default` | The trigger. Rendered `as-child`, so no wrapper element is added |

## `content` is a string, and that is the design

There is no slot for rich content. No links, no buttons, no headings.

A tooltip is hover-triggered and never holds focus, so **an interactive element
inside one is unreachable by keyboard by construction**. Typing `content` as
`string` closes that whole failure class at the API boundary rather than in a
documentation warning nobody reads.

If it needs a link or a button, you want a popover — a different component with
different focus semantics, deliberately **not in v1** (`ROADMAP.md`, "Considered,
not planned"). If it needs a paragraph, put it in the page.

## When to use

- Naming an icon-only control for sighted pointer users.
- A short clarification on a control whose label has to stay terse.
- Explaining why a control is unavailable — see the disabled pattern below.

## When not to use

- **For anything essential.** Tooltips do not exist on touch, are invisible until
  interaction, and vanish. If the user must know it, it belongs in visible text,
  an accessible label, or a dialog. A tooltip is progressive enhancement.
- **As the accessible name.** An icon button needs its own `aria-label`. The
  tooltip is the visible echo of that name, not a substitute — `aria-describedby`
  is a _description_, and some readers skip descriptions entirely.
- **For anything interactive.** See above.
- **On a truly `disabled` element.** It will never open. See below.
- **On body text.** A tooltip on a word is a footnote wanting to be a footnote.

## The disabled-trigger trap

The most-asked tooltip question in every library. A `disabled` element fires no
pointer or focus events, so a tooltip on one **never opens** — and that is
browser behaviour, not something rowkit can work around.

```vue
<!-- ✗ Never opens. -->
<Tooltip content="Upgrade to export">
  <Button disabled>Export</Button>
</Tooltip>

<!-- ✓ Focusable, so the tooltip can explain itself. -->
<Tooltip content="Upgrade your plan to export">
  <Button aria-disabled="true" @click="showUpgrade">Export</Button>
</Tooltip>
```

`aria-disabled` keeps the control in the tab order and announces it as
unavailable, while leaving it able to fire events. Handle the click as a no-op,
or use it to explain. This is exactly the case where a tooltip is most valuable,
so the pattern is worth the extra attribute.

## Touch

Tooltips fundamentally do not work on touch: there is no hover. Long-press shows
one where the platform supports it, and that is the whole story.

**Never put essential information in a tooltip.** This is the same rule as "when
not to use", repeated here because it is the one people skip.

## The provider, and the toolbar sweep

A single `<Tooltip>` needs no setup — it supplies its own provider when there is
not one above it.

One behaviour needs a shared provider, because the state is shared:
`skipDelayDuration`, the grace period that lets a pointer sweep across a row of
icon buttons and show each tooltip immediately after the first. Without it, every
button in a toolbar re-pays the full delay.

```vue
<script setup>
import { TooltipProvider } from 'rowkit'
</script>

<template>
  <TooltipProvider :delay-duration="300" :skip-delay-duration="500">
    <!-- toolbar -->
  </TooltipProvider>
</template>
```

`TooltipProvider` is Reka's, re-exported unwrapped — it renders nothing, and
wrapping it would mean a component and a props table to rename two options. It is
**the one place rowkit's API uses Reka's prop names** (`delayDuration`,
`skipDelayDuration`) rather than its own `delay`. A rowkit `Tooltip` inside a
provider defers to it rather than shadowing it.

## Keyboard

| Key               | Action                                             |
| ----------------- | -------------------------------------------------- |
| <kbd>Tab</kbd>    | Focusing the trigger opens the tooltip immediately |
| <kbd>Escape</kbd> | Dismisses it, leaving focus where it was           |

**Focus opens it with no delay.** The delay exists to stop tooltips firing as a
pointer crosses a toolbar, and that problem does not exist for the keyboard.

## Accessibility

**Opens on focus, not hover alone.** A hover-only tooltip is invisible to
keyboard users. Covered by an interaction test, because it is easy to lose.

**`aria-describedby` links the trigger to the content.** Reka renders the text
twice: once as the visible bubble, and once in a visually-hidden `role="tooltip"`
span that the trigger references. That split is deliberate — the description is
announced once rather than announcing a nested tooltip as well.

**Escape dismisses without moving focus** (WCAG 1.4.13), and the tooltip stays
open while the pointer travels onto it — the 4px offset is bridged by Reka's
hoverable content, so the tooltip is not snatched away mid-read.

**Motion is ambient**, so it is gated behind `motion-safe:` and collapses to an
instant show/hide under `prefers-reduced-motion`.

## Dark mode

The bubble uses `neutral-solid` with `neutral-on-solid`, which inverts with the
theme — dark bubble on a light page, light bubble on a dark one — so it always
reads as a layer above the surface rather than part of it.
